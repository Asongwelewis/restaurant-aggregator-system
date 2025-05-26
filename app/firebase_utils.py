import firebase_admin
# import pyrabase
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

# firebaseconfig = {
#         "project_info": {
#         "project_number": "688951666235",
#         "project_id": "ras-3854a",
#         "storage_bucket": "ras-3854a.firebasestorage.app"
#     },
#     "client": [
#         {
#             "client_info": {
#                 "mobilesdk_app_id": "1:688951666235:android:198fd3c21a7fc14ab3de1e",
#                 "android_client_info": {
#                     "package_name": "myapp.com"
#                 }
#             },
#             "oauth_client": [],
#             "api_key": [
#                 {
#                     "current_key": "AIzaSyA4ZSAip_7BWgu7LJhbb8kSjZnsVp27Pp4"
#                 }
#             ],
#             "services": {
#                 "appinvite_service": {
#                     "other_platform_oauth_client": []
#                 }
#             }
#         }
#     ],
#     "configuration_version": "1"
# }

# firebase = pyrabase.initialize_app(firebaseconfig)

def verify_token_and_role(request):
    from fastapi import Request, HTTPException
    id_token = request.headers.get("Authorization")
    if not id_token:
        raise HTTPException(status_code=403, detail="Missing Authorization token")
    try:
        decoded_token = auth.verify_id_token(id_token)
        claims = decoded_token.get("claims", {})
        if decoded_token.get("firebase", {}).get("sign_in_provider") == "anonymous":
            decoded_token["role"] = "guest"
        else:
            decoded_token["role"] = claims.get("role", "user")  # Default to 'user'
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid token: {str(e)}")