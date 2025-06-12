from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi import status
from models import UserRegister, UserLogin, EmailRequest, RefreshTokenRequest, NotificationToken
from utils import register_user, login_with_email_password, get_current_user
import uuid
import httpx
import cloudinary.uploader
from firebase_admin import db, auth
import os
from fastapi.responses import JSONResponse
import datetime

router = APIRouter()

FIREBASE_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

@router.post("/user/register")
async def register(user: UserRegister):
    try:
        uid = register_user(user.email, user.password, user.name)
        return {"uid": uid, "status": "registered"}
    except Exception as e:
        print("Register error:", e)
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/auth/login")
async def login(user: UserLogin):
    return login_with_email_password(user.email, user.password)

@router.post("/auth/guest-session")
async def create_guest_session():
    guest_id = f"guest_{uuid.uuid4().hex[:8]}"
    return {"guest_id": guest_id, "status": "guest"}

@router.get("/auth/profile")
async def get_profile(uid: str = Depends(get_current_user)):
    user_data = db.reference(f"users/{uid}").get()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.post("/user/profile/update")
async def update_profile(updates: dict, uid: str = Depends(get_current_user)):
    db.reference(f"users/{uid}").update(updates)
    return {"status": "updated"}

@router.post("/user/forgot-password")
async def forgot_password(data: EmailRequest):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={FIREBASE_API_KEY}"
    payload = {
        "requestType": "PASSWORD_RESET",
        "email": data.email
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(url, json=payload)
        result = response.json()
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Password reset email sent."}

@router.post("/user/refresh-token")
async def refresh_token(data: RefreshTokenRequest):
    url = f"https://securetoken.googleapis.com/v1/token?key={FIREBASE_API_KEY}"
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": data.refresh_token
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=payload)
        result = response.json()
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {
        "id_token": result.get("id_token"),
        "refresh_token": result.get("refresh_token"),
        "expires_in": result.get("expires_in"),
        "user_id": result.get("user_id")
    }

@router.delete("/auth/delete-account")
async def delete_account(uid: str = Depends(get_current_user)):
    try:
        db.reference(f"users/{uid}").delete()
        auth.delete_user(uid)
        return {"message": "User account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")

@router.post("/auth/profile/upload-picture",
    responses={
        200: {
            "description": "Successful upload",
            "content": {
                "application/json": {
                    "example": {"profilePic": "https://res.cloudinary.com/example/image/upload/v123/profile_pics/uid123/profile.jpg"}
                }
            }
        },
        401: {
            "description": "Unauthorized - Invalid or missing token",
            "content": {
                "application/json": {
                    "example": {"detail": "Could not validate credentials"}
                }
            }
        },
        413: {
            "description": "File too large",
            "content": {
                "application/json": {
                    "example": {"detail": "File size exceeds 5MB limit"}
                }
            }
        },
        415: {
            "description": "Unsupported media type",
            "content": {
                "application/json": {
                    "example": {"detail": "Only image files are allowed"}
                }
            }
        },
        500: {
            "description": "Upload failed",
            "content": {
                "application/json": {
                    "example": {"detail": "Cloudinary upload failed: [error details]"}
                }
            }
        }
    },
    summary="Upload profile picture",
    description="Upload a new profile picture for the authenticated user. Accepts JPEG, PNG, or GIF images up to 5MB."
)
async def upload_profile_picture(
    file: UploadFile = File(..., description="Image file to upload (JPEG, PNG, GIF)"),
    uid: str = Depends(get_current_user)
):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, or GIF images are allowed"
        )

    # Validate file size (5MB max)
    max_size = 5 * 1024 * 1024  # 5MB
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset cursor
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds {max_size//(1024*1024)}MB limit"
        )

    try:
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(
            contents,
            folder=f"profile_pics/{uid}",
            public_id="profile",
            overwrite=True,
            resource_type="image"
        )
        image_url = upload_result["secure_url"]
        db.reference(f"users/{uid}").update({"profilePic": image_url})
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"profilePic": image_url}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cloudinary upload failed: {str(e)}"
        )
# async def upload_profile_picture(file: UploadFile = File(...), uid: str = Depends(get_current_user)):
#     try:
#         contents = await file.read()
#         upload_result = cloudinary.uploader.upload(
#             contents,
#             folder=f"profile_pics/{uid}",
#             public_id="profile",
#             overwrite=True,
#             resource_type="image"
#         )
#         image_url = upload_result["secure_url"]
#         db.reference(f"users/{uid}").update({"profilePic": image_url})
#         return {"profilePic": image_url}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

@router.post("/auth/logout")
async def logout(uid: str = Depends(get_current_user)):
    return {"message": "Logout successful – client should discard token"}

@router.post("/notifications/register")
async def register_notification(data: NotificationToken, uid: str = Depends(get_current_user)):
    db.reference(f"notifications/{uid}").set({"device_token": data.device_token})
    return {"message": "Device token registered successfully"}

@router.post("/auth/google")
async def google_auth(request: Request):
    """
    Authenticate with Google ID token
    
    Parameters:
    - id_token: Google ID token from frontend
    
    Returns:
    - Firebase auth tokens
    """
    try:
        data = await request.json()
        id_token = data.get("id_token")
        
        if not id_token:
            raise HTTPException(status_code=400, detail="Google ID token is required")
        
        # Verify the Google ID token and create Firebase auth
        decoded_token = auth.verify_id_token(id_token)
        firebase_token = auth.create_custom_token(decoded_token['uid'])
        
        # Return Firebase token to client
        return {
            "token": firebase_token,
            "uid": decoded_token['uid'],
            "email": decoded_token.get('email'),
            "name": decoded_token.get('name'),
            "picture": decoded_token.get('picture')
        }
        
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google authentication failed: {str(e)}")

@router.post("/auth/google/register")
async def google_register(request: Request):
    """
    Register a new user with Google authentication
    
    Parameters:
    - id_token: Google ID token from frontend
    - additional_data: Any additional user data (name, etc.)
    
    Returns:
    - User profile with Firebase tokens
    """
    try:
        data = await request.json()
        id_token = data.get("id_token")
        additional_data = data.get("additional_data", {})
        
        if not id_token:
            raise HTTPException(status_code=400, detail="Google ID token is required")
        
        # Verify Google token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # Create user in Firebase
        user_record = auth.get_user(uid)
        
        # Create user profile in database
        user_profile = {
            "email": user_record.email,
            "name": additional_data.get("name") or user_record.display_name,
            "profilePic": additional_data.get("picture") or user_record.photo_url,
            "provider": "google",
            "createdAt": datetime.datetime.now().isoformat()
        }
        
        db.reference(f"users/{uid}").set(user_profile)
        
        # Create Firebase token
        firebase_token = auth.create_custom_token(uid)
        
        return {
            "token": firebase_token,
            "user": user_profile,
            "status": "registered"
        }
        
    except auth.UserNotFoundError:
        # User doesn't exist yet - this is normal for first-time registration
        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Create user in Firebase
            user = auth.create_user(
                uid=uid,
                email=decoded_token.get('email'),
                display_name=additional_data.get("name") or decoded_token.get('name'),
                photo_url=additional_data.get("picture") or decoded_token.get('picture')
            )
            
            # Create user profile
            user_profile = {
                "email": user.email,
                "name": user.display_name,
                "profilePic": user.photo_url,
                "provider": "google",
                "createdAt": datetime.datetime.now().isoformat()
            }
            
            db.reference(f"users/{uid}").set(user_profile)
            
            firebase_token = auth.create_custom_token(uid)
            
            return {
                "token": firebase_token,
                "user": user_profile,
                "status": "registered"
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"User creation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google registration failed: {str(e)}")