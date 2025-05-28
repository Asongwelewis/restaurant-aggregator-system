
import jwt
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, Depends
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = 'TfV5snK9v7mONySkFZmnp7qtARSIW4RxH5l2p9RGcSg' # os.getenv("JWT_SECRET")
# if not SECRET_KEY:
#     raise ValueError("JWT_SECRET is not set in .env file!")

EXPIRE_MINUTES = int(60) #os.getenv("JWT_EXPIRE_MINUTES", "60"))
ALGORITHM = "HS256"

def create_jwt_token(payload: dict):
    to_encode = payload.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=403, detail="Missing Authorization token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid token")
