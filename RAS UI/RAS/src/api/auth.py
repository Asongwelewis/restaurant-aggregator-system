from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class UserSchema(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserSchema):
    # TODO: Add Firebase or DB user creation logic here
    if user.email == "existing@example.com":
        raise HTTPException(status_code=400, detail="Email already exists")
    return {"uid": "user123", "email": user.email}

@router.post("/login")
async def login(user: UserSchema):
    # TODO: Authenticate user and return token
    return {"token": "fake-jwt-token"}
