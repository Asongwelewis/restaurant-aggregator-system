import firebase_admin
import os
import requests
from dotenv import load_dotenv
from firebase_admin import auth as firebase_auth
from firebase_admin import auth, credentials, exceptions
from fastapi import HTTPException

cred = credentials.Certificate("service-account.json")
if not firebase_admin._apps:
    firebase_app = firebase_admin.initialize_app(cred)

load_dotenv()
# FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

def register_user(username: str, email: str, password: str):
    try:
        user_record = auth.create_user(email=email, password=password)
        return user_record.uid
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except exceptions.FirebaseError as e:
        raise HTTPException(status_code=400, detail=f"Firebase error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# def verify_firebase_token(id_token: str):
#     try:
#         decoded = firebase_auth.verify_id_token(id_token)
#         return decoded["uid"]
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid ID token")

def login_with_email_password(email: str, password: str):
    url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4ZSAip_7BWgu7LJhbb8kSjZnsVp27Pp4"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    data = response.json()
    return {
        "id_token": data["idToken"],
        "refresh_token": data["refreshToken"],
        "uid": data["localId"]
    }