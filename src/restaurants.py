@router.get("/search")
async def search_restaurants(cuisine: str = ""):
    if cuisine:
        query = db.collection("restaurants").where("cuisine", "==", cuisine)
    else:
        query = db.collection("restaurants")

    results = [doc.to_dict() for doc in query.stream()]
    return {"results": results}