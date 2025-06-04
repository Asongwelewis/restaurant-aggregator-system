from fastapi import FastAPI, HTTPException
from firebase_admin import db
import uuid
from fastapi import Header , Depends
from app2.models import UserLogin
from app2.auth import login_with_email_password
from app2.auth import register_user , verify_firebase_token
from app2.models import UserRegister
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi import Request
from slowapi.errors import RateLimitExceeded
from slowapi.decorator import limiter

limiter = Limiter(key_func=get_remote_address)


app = FastAPI(
    description="Restaurant Aggregator System API",
    title="Restaurant Aggregator System",
    docs_url="/"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/register")
@limiter.limit("5/minute")
async def register(user: UserRegister):
    try:
        uid = register_user(user.username, user.email, user.password)
        return {"uid": uid, "status": "registered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login(user: UserLogin):
    tokens = login_with_email_password(user.email, user.password)
    return {
        "uid": tokens["uid"],
        "id_token": tokens["id_token"],
        "status": "authenticated"
    }

@app.post("/guest-session")
async def create_guest_session():
    guest_id = f"guest_{uuid.uuid4().hex[:8]}"
    # Optionally store this in Firebase or memory
    return {"guest_id": guest_id, "status": "guest"}

@app.get("/profile")
async def get_profile(uid: str = Depends(get_current_user)):
    # uid = verify_firebase_token(id_token)
    user_data = db.reference(f"users/{uid}").get()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data


@app.post("/profile/update")
async def update_profile(
    updates: dict,
    uid: str = Depends(get_current_user)
):
    # uid = verify_firebase_token(id_token)
    db.reference(f"users/{uid}").update(updates)
    return {"status": "updated"}