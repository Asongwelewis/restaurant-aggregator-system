import firebase_admin
from firebase_admin import credentials, db ,auth
import json

# Path to your Firebase service account key
cred = credentials.Certificate("firebase_key.json")

# Initialize app with Realtime Database URL
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://ras-3854a-default-rtdb.firebaseio.com/'
})

# Load your data
with open('initialData.json', 'r') as f:
    data = json.load(f)

# Push entire structure to root
ref = db.reference('/')
ref.set(data)

print("Data uploaded successfully.")
