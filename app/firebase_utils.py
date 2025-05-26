import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

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