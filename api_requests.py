
# import requests

# BASE_URL = "http://localhost:8000"

# def register_user():
#     url = f"{BASE_URL}/register"
#     payload = {
#         "email": "user@example.com",
#         "password": "secure123",
#         "name": "John Doe",
#         "phone": "1234567890"
#     }
#     res = requests.post(url, json=payload)
#     print("Register:", res.status_code, res.json())
#     return res.json()

# def login_user():
#     url = f"{BASE_URL}/login"
#     payload = {
#         "email": "user@example.com",
#         "password": "secure123"
#     }
#     res = requests.post(url, json=payload)
#     print("Login:", res.status_code, res.json())
#     return res.json()

# def create_guest_session():
#     url = f"{BASE_URL}/guest-session"
#     res = requests.post(url)
#     print("Guest session:", res.status_code, res.json())
#     return res.json()

# def get_profile(id_token):
#     url = f"{BASE_URL}/profile"
#     headers = {
#         "id-token": id_token
#     }
#     res = requests.get(url, headers=headers)
#     print("Profile:", res.status_code, res.json())
#     return res.json()

# def update_profile(id_token):
#     url = f"{BASE_URL}/profile/update"
#     headers = {
#         "id-token": id_token,
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "phone": "9998887777",
#         "name": "John D."
#     }
#     res = requests.post(url, json=payload, headers=headers)
#     print("Update profile:", res.status_code, res.json())
#     return res.json()

# if __name__ == "__main__":
#     # Optional: register_user()

#     login_data = login_user()
#     token = login_data.get("id_token")

#     if token:
#         get_profile(token)
#         update_profile(token)

#     # Optional: create_guest_session()

import httpx
from pydantic import BaseModel
from typing import Optional

# Base URL for the API (adjust as needed)
BASE_URL = "http://localhost:8000"  # Change this if your API is hosted elsewhere

# Models matching the API request schemas
class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class EmailRequest(BaseModel):
    email: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class Restaurant(BaseModel):
    name: str
    description: str
    location: str
    rating: float = 0.0
    num_ratings: int = 0

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    # Add other updatable fields here

class APIClient:
    def _init_(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.client = httpx.AsyncClient()
        self.id_token = None
        self.refresh_token = None

    async def register_user(self, user_data: UserRegister):
        """Register a new user"""
        url = f"{self.base_url}/register"
        response = await self.client.post(url, json=user_data.dict())
        return response.json()

    async def login(self, credentials: UserLogin):
        """Login with email and password"""
        url = f"{self.base_url}/auth/login"
        response = await self.client.post(url, json=credentials.dict())
        data = response.json()
        if "id_token" in data:
            self.id_token = data["id_token"]
            self.refresh_token = data["refresh_token"]
        return data

    async def create_guest_session(self):
        """Create a guest session"""
        url = f"{self.base_url}/auth/guest-session"
        response = await self.client.post(url)
        return response.json()

    async def get_profile(self):
        """Get current user profile (requires authentication)"""
        if not self.id_token:
            raise ValueError("Not authenticated")
            
        url = f"{self.base_url}/auth/profile"
        headers = {"id_token": self.id_token}
        response = await self.client.get(url, headers=headers)
        return response.json()

    async def update_profile(self, updates: dict):
        """Update user profile (requires authentication)"""
        if not self.id_token:
            raise ValueError("Not authenticated")
            
        url = f"{self.base_url}/auth/profile/update"
        headers = {"id_token": self.id_token}
        response = await self.client.post(url, json=updates, headers=headers)
        return response.json()

    async def forgot_password(self, email: str):
        """Request password reset email"""
        url = f"{self.base_url}/auth/forgot-password"
        request_data = EmailRequest(email=email)
        response = await self.client.post(url, json=request_data.dict())
        return response.json()

    async def refresh_token(self):
        """Refresh authentication token"""
        if not self.refresh_token:
            raise ValueError("No refresh token available")
            
        url = f"{self.base_url}/auth/refresh-token"
        request_data = RefreshTokenRequest(refresh_token=self.refresh_token)
        response = await self.client.post(url, json=request_data.dict())
        data = response.json()
        if "id_token" in data:
            self.id_token = data["id_token"]
            if "refresh_token" in data:
                self.refresh_token = data["refresh_token"]
        return data

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Example usage
# async def main():
#     client = APIClient()
    
#     try:
#         # Example: Register a new user
#         new_user = UserRegister(
#             email="user@example.com",
#             password="securepassword123",
#             name="John Doe"
#         )
#         registration = await client.register_user(new_user)
#         print("Registration:", registration)
        
#         # Example: Login
#         credentials = UserLogin(
#             email="user@example.com",
#             password="securepassword123"
#         )
#         login_data = await client.login(credentials)
#         print("Login:", login_data)
        
#         # Example: Get profile
#         profile = await client.get_profile()
#         print("Profile:", profile)
        
#         # Example: Update profile
#         updates = {"name": "John Updated"}
#         update_result = await client.update_profile(updates)
#         print("Update result:", update_result)
        
#         # Example: Refresh token
#         refresh_result = await client.refresh_token()
#         print("Refresh result:", refresh_result)
        
#         # Example: Create guest session
#         guest_session = await client.create_guest_session()
#         print("Guest session:", guest_session)
        
#         # Example: Forgot password
#         forgot_pass = await client.forgot_password("user@example.com")
#         print("Forgot password:", forgot_pass)
        
#     finally:
#         await client.close()

# if __name__ == "_main_":
#     import asyncio
#     asyncio.run(main())