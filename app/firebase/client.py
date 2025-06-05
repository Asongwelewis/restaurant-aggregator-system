import firebase_admin
from firebase_admin import credentials, db
import os
import logging

logger = logging.getLogger("firebase")
logger.setLevel(logging.INFO)

try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    SERVICE_ACCOUNT_KEY = os.path.join(current_dir, "firebase-key.json")
    DATABASE_URL = "https://ras-3854a-default-rtdb.firebaseio.com/"
    
    if not os.path.exists(SERVICE_ACCOUNT_KEY):
        raise FileNotFoundError(f"Firebase key file not found at: {SERVICE_ACCOUNT_KEY}")
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
        firebase_admin.initialize_app(cred, {
            'databaseURL': DATABASE_URL
        })
        logger.info("Firebase initialized successfully")
    
    rtdb = db.reference()
    logger.info(f"Database reference created for {DATABASE_URL}")

except Exception as e:
    logger.error(f"Firebase initialization failed: {str(e)}")
    raise