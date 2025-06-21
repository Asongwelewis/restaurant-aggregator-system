from fastapi import Depends

# Mock authentication functions that always pass
async def verify_api_key():
    return {"user_id": "test-user"}

async def verify_owner():
    return {"user_id": "test-owner"}

async def verify_admin():
    return {"user_id": "test-admin"}