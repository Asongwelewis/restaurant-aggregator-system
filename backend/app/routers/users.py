from fastapi import APIRouter, HTTPException
from app.firebase.client import rtdb

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_profile(user_id: str):
    data = rtdb.child("users").child(user_id).get()
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return data

@router.put("/me")
def update_profile(user_id: str, profile: dict):
    ref = rtdb.child("users").child(user_id)
    if not ref.get():
        raise HTTPException(status_code=404, detail="User not found")
    ref.update(profile)
    return {"message": "Profile updated"}

@router.delete("/me")
def delete_profile(user_id: str):
    ref = rtdb.child("users").child(user_id)
    if not ref.get():
        raise HTTPException(status_code=404, detail="User not found")
    ref.delete()
    return {"message": "Profile deleted"}

@router.post("/me/change-password")
def change_password(user_id: str, new_password: str):
    ref = rtdb.child("users").child(user_id)
    if not ref.get():
        raise HTTPException(status_code=404, detail="User not found")
    ref.update({"password": new_password})
    return {"message": "Password changed"}