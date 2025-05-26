from fastapi import FastAPI
from app.auth import router as auth_router
from app.roles import router as roles_router
from app.profile import router as profile_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(roles_router, prefix="/roles", tags=["Roles"])
app.include_router(profile_router, prefix="/profile", tags=["Profile"])