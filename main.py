# main.py
from fastapi import FastAPI, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr
from firebase_admin import auth
from firebase_utils import *  # initializes Firebase

app = FastAPI()

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str
    # display_name: str = ""

@app.post("/register")
def register(user: RegisterUser):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.display_name
        )
        return {
                "message": "User created successfully", 
                "uid": user_record.uid,
                "email": user_record.email,
                "username":user_record.display_name
        }
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    set_user_role(user_record.uid,"user")


def verify_token_and_role(request: Request):
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
        role = decoded_token.get("role") or decoded_token.get("claim", {}).get("role")
        decode_token["role"] = role 
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

@app.get("/admin-only")
def admin_route(user_data=Depends(verify_token_and_role)):
    if user_data.get("role") !="admin":
        raise HTTPException(starus_code=403,detail="Admins only")
        return{"message": "Welcome, admin!"}

@app.get("/user*only")
def user_route(user_dat=Depends(verify_token_and_role)):
    if user_data.get("role") !="user":
        raise HTTPException(status_code=403,detail="Users only")
        return{"message": "Welcome, user!"}