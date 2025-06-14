from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailRequest(BaseModel):
    email: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class NotificationToken(BaseModel):
    device_token: str

class Restaurant(BaseModel):
    name: str
    description: str
    location: str
    rating: float = 0.0
    num_ratings: int = 0