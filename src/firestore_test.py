import os
import json
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import HTTPException
from google.cloud.firestore_v1 import Client


def init_firestore():
    try:
        # Try environment variable first
        if "FIREBASE_CREDENTIALS_JSON" in os.environ:
            cred_dict = json.loads(os.environ["FIREBASE_CREDENTIALS_JSON"])
            cred = credentials.Certificate(cred_dict)
        elif os.path.exists("service-account.json"):
            cred = credentials.Certificate("service-account.json")
        else:
            raise ValueError("No Firebase credentials found")

        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)

        return firestore.client()
    except Exception as e:
        raise HTTPException(500, f"Firestore init failed: {str(e)}")

db: Client = init_firestore()