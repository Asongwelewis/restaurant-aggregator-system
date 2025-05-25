# main.py
from fastapi import FastAPI, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr
from firebase_admin import auth
from firebase_utils import *  # initializes Firebase

app = FastAPI()

class RegisterUser(BaseModel):
    email: EmailStr
    password: str
    display_name: str = ""

@app.post("/register")
def register(user: RegisterUser):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.display_name
        )
        return {"message": "User created successfully", "uid": user_record.uid}
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def verify_token(request: Request):
    id_token = request.headers.get("Authorization")
    if not id_token:
        raise HTTPException(status_code=403, detail="Authorization token missing")
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid token: {str(e)}")

def verify_token(request: Request):
    id_token = request.headers.get("Authorization")
    if not id_token:
        raise HTTPException(status_code=403, detail="Authorization token missing")
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid token: {str(e)}")

@app.get("/guest-access")
def guest_route(user_data=Depends(verify_token)):
    if user_data.get("provider_id") == "anonymous" or user_data.get("firebase", {}).get("sign_in_provider") == "anonymous":
        return {"message": "Welcome, guest!", "uid": user_data["uid"]}
    else:
        raise HTTPException(status_code=403, detail="Not a guest user")

@app.get("/profile")
def profile(user_data=Depends(verify_token)):
    return {"message": "Authenticated", "user": user_data}