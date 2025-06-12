from app.models import flutterpay_request
from app.helper_function import initialise_payment
from fastapi import FastAPI


flutter_router = APIRouter(
    prefix="/flutterwave",
    tags=["flutterwave"]
)

@flutter_router.post("/pay/")
async def pay_now(payment: flutterpay_request):
    result = await initialise_payment(
        email=payment.email,
        amount=payment.amount,
        phone=payment.phone,
        name=payment.name,
        redirect_url=payment.redirect_url
    )
    if result["status"] == "success":
        return {
            "message": "payment link created",
            "payment_link": result["data"]["link"]
        }
    else:
        return {
            "message": "something went wrong",
            "error": result.get("message", "Unknown error")
        }
 
    
