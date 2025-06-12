from fastapi import FastAPI
from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials
import cloudinary
from models import UserRegister, UserLogin, EmailRequest, RefreshTokenRequest, NotificationToken

load_dotenv()

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate("ras-3854a-firebase-adminsdk-fbsvc-909b3d4db8.json")
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://ras-3854a-default-rtdb.firebaseio.com/" #os.getenv("FIREBASE_DB_URL")
    })

# Initialize Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

app = FastAPI(
    description="Restaurant Aggregator System API",
    title="Restaurant Aggregator System",
    docs_url="/"
)

from routes import router
app.include_router(router)
# app.include_router(router, prefix="/routes", tags=["Routes"])
