from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    # Replace this with your real authentication logic
    if request.email == "test@example.com" and request.password == "password":
        return {"access_token": "fake-jwt-token", "user_id": 1}
    raise HTTPException(status_code=401, detail="Invalid credentials")
