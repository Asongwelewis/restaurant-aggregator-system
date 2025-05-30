from firestore_test import db
from schemas import Restaurant

def add_test_data():
    restaurants = [
        {"name": "Pizza Place", "cuisine": "Italian"},
        {"name": "Burger Joint", "cuisine": "American"},
    ]

    for data in restaurants:
        db.collection("restaurants").add(data)
    print("Added test data")

if __name__ == "__main__":
    add_test_data()