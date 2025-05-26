from fastapi import APIRouter, Depends
from app.jwt_auth import verify_jwt, create_jwt

router = APIRouter()

@router.get("/secure")
def secure_endpoint(user_data=Depends(verify_jwt)):
    return {"message": "Accessed with custom JWT", "data": user_data}

@router.post("/generate-token")
def generate_token():
    payload = {
        "uid": "some-user-id",
        "role": "admin"
    }
    token = create_jwt(payload)
    return {"token": token}
