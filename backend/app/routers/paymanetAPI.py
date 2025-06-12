from helper_function import verify_payment,store_payment
from fastapi import FastAPI,HTTPException,APIRouter
 
router = APIRouter()

@router.post("/verify-payment/")
async def verify_and_store(transaction_id:str,user_id:str,restaurant_id:str):
    result = verify_payment(transaction_id)

    if result["status"] == "success":
        payment_info = {
            "transaction_id": transaction_id,
            "restaurant_id": restaurant_id,
            "amount": result["data"]["amount"],
            "payment_method":result["data"]["payment_type"],
            "status":result["data"]["status"],
            "timestamp": result["data"]["created_at"]
        }

        store_payment(user_id,payment_info)
        return {"message":"payment stored","data":payment_info}
    else:
        raise HTTPException(status_code= 400, detail= "payment verification failed ")