from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr
import firebase_admin
from firebase_admin import credentials, auth, db
from cachetools import TTLCache
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
from fastapi.requests import Request
from fastapi import UploadFile, File
import os
import httpx
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader


load_dotenv()
# Initialize Firebase Admin SDK

if not firebase_admin._apps:
    cred = credentials.Certificate("ras-3854a-firebase-adminsdk-fbsvc-8fdfdba908.json")
    firebase_admin.initialize_app(cred, {
        "databaseURL": os.getenv("FIREBASE_DB_URL")
    })

# Initialize Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Initialize FastAPI app

app = FastAPI(
    description="Restaurant Aggregator System API",
    title="Restaurant Aggregator System",
    docs_url="/"
)

FIREBASE_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

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
   # phone: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailRequest(BaseModel):
    email: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class NotificationToken(BaseModel):
    device_token: str

class Restaurant(BaseModel):
    name: str
    description: str
    location: str
    rating: float = 0.0
    num_ratings: int = 0

# ---------------------
# Utility Functions
# ---------------------
def register_user(email: str, password: str, name: str):
    try:
        user_record = auth.create_user(email=email, password=password)
        db.reference(f"users/{user_record.uid}").set({
            "email": email,
            "name": name,
            #"phone": phone or "",
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
@app.post("/user/register")
async def register(user: UserRegister):
    uid = register_user(user.email, user.password, user.name, user.phone)
    return {"uid": uid, "status": "registered"}

@app.post("/auth/login")
async def login(user: UserLogin):
    return login_with_email_password(user.email, user.password)

@app.post("/auth/guest-session")
async def create_guest_session():
    import uuid
    guest_id = f"guest_{uuid.uuid4().hex[:8]}"
    return {"guest_id": guest_id, "status": "guest"}

@app.get("/auth/profile")
async def get_profile(uid: str = Depends(get_current_user)):
    user_data = db.reference(f"users/{uid}").get()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@app.post("/user/profile/update")
async def update_profile(updates: dict, uid: str = Depends(get_current_user)):
    db.reference(f"users/{uid}").update(updates)
    return {"status": "updated"}

@app.post("/user/forgot-password")
async def forgot_password(data: EmailRequest):
    """
    Sends a password reset email to the user.
    """
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={FIREBASE_API_KEY}"
    payload = {
        "requestType": "PASSWORD_RESET",
        "email": data.email
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(url, json=payload)
        result = response.json()

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    
    return {"message": "Password reset email sent."}

@app.post("/user/refresh-token")
async def refresh_token(data: RefreshTokenRequest):
    """
    Refreshes Firebase ID token using the provided refresh token.
    """
    url = f"https://securetoken.googleapis.com/v1/token?key={FIREBASE_API_KEY}"
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": data.refresh_token
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=payload)
        result = response.json()

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"]["message"])

    return {
        "id_token": result.get("id_token"),
        "refresh_token": result.get("refresh_token"),
        "expires_in": result.get("expires_in"),
        "user_id": result.get("user_id")
    }

@app.delete("/auth/delete-account")
async def delete_account(uid: str = Depends(get_current_user)):
    """
    Deletes a user's Firebase auth account and their data from Realtime DB.
    """
    try:
        db.reference(f"users/{uid}").delete()
        auth.delete_user(uid)
        return {"message": "User account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")

@app.post("/auth/profile/upload-picture")
async def upload_profile_picture(file: UploadFile = File(...), uid: str = Depends(get_current_user)):
    try:
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(
            contents,
            folder=f"profile_pics/{uid}",
            public_id="profile",  # always named 'profile' for overwriting
            overwrite=True,
            resource_type="image"
        )
        image_url = upload_result["secure_url"]

        # Save image URL to Firebase DB
        db.reference(f"users/{uid}").update({"profilePic": image_url})

        return {"profilePic": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")


@app.post("/auth/logout")
async def logout(uid: str = Depends(get_current_user)):
    """
    Logout endpoint – just a placeholder since Firebase handles logout client-side.
    """
    return {"message": "Logout successful – client should discard token"}

@app.post("/notifications/register")
async def register_notification(data: NotificationToken, uid: str = Depends(get_current_user)):
    """
    Save the device token to the database under the user's record.
    """
    db.reference(f"notifications/{uid}").set({"device_token": data.device_token})
    return {"message": "Device token registered successfully"}