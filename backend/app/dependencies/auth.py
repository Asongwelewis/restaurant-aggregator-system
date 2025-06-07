from fastapi import HTTPException, status, Request

API_KEY = "123"  # Change this to a secure value!

def verify_api_key(request: Request):
    api_key = request.headers.get("X-API-Key")
    if api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )
    return {"role": "admin"}