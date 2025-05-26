from fastapi import FastAPI
from app.auth import router as auth_router
from app.roles import router as roles_router
from app.profile import router as profile_router
import os
import uvicorn

app = FastAPI()

# Change directory to the specified path
os.chdir(r"C:\Users\840 G5\Auth and user management\restaurant-aggregator-system")

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(roles_router, prefix="/roles", tags=["Roles"])
app.include_router(profile_router, prefix="/profile", tags=["Profile"])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)