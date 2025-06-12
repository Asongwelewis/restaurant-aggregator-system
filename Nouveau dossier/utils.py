import os
from fastapi import HTTPException, Header
import firebase_admin
from firebase_admin import auth, db

def register_user(email: str, password: str, name: str):
    try:
        user_record = auth.create_user(email=email, password=password)
        db.reference(f"users/{user_record.uid}").set({
            "email": email,
            "name": name,
            "role": "user"
        })
        return user_record.uid
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

def login_with_email_password(email: str, password: str):
    import requests
    api_key = os.getenv("FIREBASE_WEB_API_KEY")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    data = response.json()
    if response.status_code != 200:
        error_message = data.get("error", {}).get("message", "Invalid credentials")
        raise HTTPException(status_code=401, detail=error_message)
    return {
        "uid": data["localId"],
        "id_token": data["idToken"],
        "refresh_token": data["refreshToken"]
    }

def get_current_user(id_token: str = Header(...)):
    try:
                # Remove 'Bearer ' prefix if present
        if id_token.startswith("Bearer "):
            id_token = id_token[7:]
        decoded = auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired ID token")   
    #     decoded = auth.verify_id_token(id_token)
    #     return decoded["uid"]
    # except Exception:
    #     raise HTTPException(status_code=401, detail="Invalid or expired ID token")