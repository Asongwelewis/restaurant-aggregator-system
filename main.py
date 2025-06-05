from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr
import firebase_admin
from firebase_admin import credentials, auth, db
from cachetools import TTLCache
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from fastapi.requests import Request
import os
from dotenv import load_dotenv


load_dotenv()
# Initialize Firebase Admin SDK

if not firebase_admin._apps:
    cred = credentials.Certificate("ras-3854a-firebase-adminsdk-fbsvc-8fdfdba908.json")
    firebase_admin.initialize_app(cred, {
        "databaseURL": os.getenv("FIREBASE_DB_URL")
    })

app = FastAPI(
    description="Restaurant Aggregator System API",
    title="Restaurant Aggregator System",
    docs_url="/"
)

# ---------------------
# Rate Limiting Middleware
# ---------------------
RATE_LIMIT = 5
WINDOW_SECONDS = 60
ip_cache = TTLCache(maxsize=10000, ttl=WINDOW_SECONDS)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        ip = request.client.host
        count = ip_cache.get(ip, 0)

        if count >= RATE_LIMIT:
            raise HTTPException(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )

        ip_cache[ip] = count + 1
        response = await call_next(request)
        return response

app.add_middleware(RateLimitMiddleware)

# ---------------------
# Models
# ---------------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---------------------
# Utility Functions
# ---------------------
def register_user(email: str, password: str, name: str, phone: str = None):
    try:
        user_record = auth.create_user(email=email, password=password)
        db.reference(f"users/{user_record.uid}").set({
            "email": email,
            "name": name,
            "phone": phone or "",
            "role": "user"
        })
        return user_record.uid
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

def login_with_email_password(email: str, password: str):
    import requests
    api_key = os.getenv("FIREBASE_WEB_API_KEY")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    data = response.json()
    return {
        "uid": data["localId"],
        "id_token": data["idToken"],
        "refresh_token": data["refreshToken"]
    }

def get_current_user(id_token: str = Header(...)):
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired ID token")

# ---------------------
# Routes
# ---------------------
@app.post("/register")
async def register(user: UserRegister):
    uid = register_user(user.email, user.password, user.name, user.phone)
    return {"uid": uid, "status": "registered"}

@app.post("/login")
async def login(user: UserLogin):
    return login_with_email_password(user.email, user.password)

@app.post("/guest-session")
async def create_guest_session():
    import uuid
    guest_id = f"guest_{uuid.uuid4().hex[:8]}"
    return {"guest_id": guest_id, "status": "guest"}

@app.get("/profile")
async def get_profile(uid: str = Depends(get_current_user)):
    user_data = db.reference(f"users/{uid}").get()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@app.post("/profile/update")
async def update_profile(updates: dict, uid: str = Depends(get_current_user)):
    db.reference(f"users/{uid}").update(updates)
    return {"status": "updated"}