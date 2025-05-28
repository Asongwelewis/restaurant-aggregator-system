from fastapi import FastAPI, HTTPException
import uuid
from fastapi import Header
from app2.models import UserLogin
from app2.auth import login_with_email_password
from app2.auth import register_user 
from app2.models import UserRegister

app = FastAPI(
    description="Restaurant Aggregator System API",
    title="Restaurant Aggregator System",
    docs_url="/"
)

@app.post("/register")
async def register(user: UserRegister):
    try:
        uid = register_user(user.username, user.email, user.password)
        return {"uid": uid}
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