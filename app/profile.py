from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from firebase_admin import auth
from app.firebase_utils import verify_token_and_role

router = APIRouter()

class UpdateProfile(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]

@router.get("/")
def get_profile(user_data=Depends(verify_token_and_role)):
    user_record = auth.get_user(user_data["uid"])
    return {
        "uid": user_record.uid,
        "email": user_record.email,
        "username": user_record.display_name,
        "role": user_data.get("role")
    }

@router.put("/")
def update_profile(update: UpdateProfile, user_data=Depends(verify_token_and_role)):
    updates = {}
    if update.username:
        updates["display_name"] = update.username
    if update.email:
        updates["email"] = update.email
    if update.password:
        updates["password"] = update.password
    try:
        auth.update_user(user_data["uid"], **updates)
        return {"message": "Profile updated"}
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))