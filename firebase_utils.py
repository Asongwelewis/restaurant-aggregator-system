import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase_Key.json")
firebase_admin.initialize_app(cred)

def set_user_role(uid: str, role: str):
    auth.set_custom_user_claims(uid, {"role": role})