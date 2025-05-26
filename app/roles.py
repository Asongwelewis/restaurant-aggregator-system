# app/roles.py

from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth
from app.firebase_utils import verify_token_and_role

router = APIRouter()

# Admin-only route
@router.get("/admin")
def admin_only(user_data=Depends(verify_token_and_role)):
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    return {"message": "Welcome, admin!", "uid": user_data['uid']}

# User-only route
@router.get("/user")
def user_only(user_data=Depends(verify_token_and_role)):
    if user_data.get("role") != "user":
        raise HTTPException(status_code=403, detail="Users only")
    return {"message": "Welcome, user!", "uid": user_data['uid']}

# Assign role (restricted to admin)
@router.post("/assign")
def assign_role(uid: str, role: str, user_data=Depends(verify_token_and_role)):
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    try:
        auth.set_custom_user_claims(uid, {"role": role})
        return {"message": f"Role '{role}' assigned to user {uid}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/guest")
def guest_only(user_data=Depends(verify_token_and_role)):
    if user_data.get("role") != "guest":
        raise HTTPException(status_code=403, detail="Guests only")
    return {"message": "Welcome, guest!", "uid": user_data['uid']}