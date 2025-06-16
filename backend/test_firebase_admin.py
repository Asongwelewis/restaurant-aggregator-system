import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("ras-3854a-firebase-adminsdk-fbsvc-909b3d4db8.json")
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    # Already initialized
    pass

try:
    user = auth.create_user(email="testuser1234@example.com", password="TestPassword123!")
    print("User created successfully:", user.uid)
except Exception as e:
    print("Error creating user:", e)
