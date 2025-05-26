from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from firebase_admin import auth 
from firebase_admin import auth as firebase_auth
from app.jwt_auth import create_jwt_token
from app.firebase_utils import *

router = APIRouter()

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str

@router.post("/register")
def register(user: RegisterUser):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.username
        )
        auth.set_custom_user_claims(user_record.uid, {"role": "user"})
        return {"message": "User created", "uid": user_record.uid}
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/login")
def login(email: EmailStr, password: str):
    try:
        user = auth.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Firebase does not support password verification directly
        # You would typically use Firebase Authentication SDK on the client side
        # to handle login and token generation.
        
        return {"message": "Login successful", "uid": user.uid}
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.post("/guest-login")
def guest_login():
    try:
        # Firebase client must authenticate anonymously and pass the ID token to backend.
        return {"message": "Use Firebase Client SDK to log in anonymously and pass token"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/firebase-login")
def firebase_login(request: Request):
    user_data = verify_token_and_role(request)
    jwt_token = create_jwt_token({
        "uid": user_data["uid"],
        "role": user_data.get("role", "user"),
        "auth_provider": "firebase"
    })
    return {
        "message": "Login successful",
        "uid": user_data["uid"],
        "role": user_data.get("role", "user"),
        "jwt": jwt_token
    }