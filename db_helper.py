from firebase_config import db
from typing import Any, Dict, List,Optional

#basic database opration
def add_document(collection: str, data: Dict[str,Any], doc_id: Optional[str] = None) -> str:
    try:
      if doc_id:
         db.collection(collection).document(doc_id).set(data)
         return doc_id
      doc_ref = db.collection(collection).add(data)
      return doc_ref[0].id
    except Exception as e:
        print("Error when inserting")
        return None
def get_doc(collection: str,doc_id: str)-> Optional[Dict[str,Any]]:
    try:
      doc = db.collection(collection).document(doc_id).get()
      if doc.exists:
          return doc.to_dict()
      return None
    except Exception as e:
        print("Error when fetching")
        return None
    
def update_document(collection: str, doc_id: str, update: Dict[str,Any]) -> bool:
    db.collection(collection).document(doc_id).update(update)
    return True

def delete_document(collection: str, doc_id: str) -> bool:
    db.collection(collection).document(doc_id).delete()
    return True

def querry_doc(collection:str,field:str,op:str,value:Any) -> List[Dict[str,Any]]:
    querry  = db.collection(collection).where(field,op,value).stream()
    return [doc.to_dict() for doc in querry]

# operation specific to the app

def book_seat(resto_id: str, user_id:str, time:str,party_size: float) -> str:
    data = {
        "date_time": time,
        "party_size": party_size,
        "restaurant_id": resto_id,
        "status": "confirmed",
        "user_id":user_id
        }
    return add_document("bookings",data)

def place_orders(resto_id:str, user_id:str, items: list[Dict[str,Any]]) -> str:
    data = {
        "restaurant_id": resto_id,
        "user_id":user_id,
        "items": items,
        "status": "pending"
    }
    return add_document("orders",data)

def review(resto_id:str, user_id:str, comment:str, rating: float,time: str) -> str:
    data = {
        "restaurant_id": resto_id,
        "user_id":user_id,
        "comment": comment,
        "rating": rating,
        "time": time
    }
    return add_document("reviews",data)

def get_reviews(resto_id: str) -> list[Dict[str,Any]]:
    return querry_doc("reviews","restaurant","==",resto_id)

