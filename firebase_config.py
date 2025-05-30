import firebase_admin
from firebase_admin import credentials,firestore
import os

cred_path = os.path.join(os.getcwd(),"ras-3854a-firebase-adminsdk-fbsvc-d45a1503f1.json")
cred = credentials.Certificate(cred_path)
 

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()