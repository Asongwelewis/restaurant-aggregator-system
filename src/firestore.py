import firebase_admin
from firebase_admin import firestore

cred = firebase_admin.credentials.Certificate("service-account.json")
firebase_admin.initialize_app(cred)


db = firestore.client()