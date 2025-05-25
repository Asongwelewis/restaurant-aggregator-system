import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase_Key.json")
firebase_admin.initialize_app(cred)