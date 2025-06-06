# Restaurant Aggregator System (Odis)

This project is a restaurant aggregator platform with a React Native (Expo) mobile UI and a FastAPI backend.

## Project Structure

- `RAS UI/RAS/` - React Native (Expo) app for the mobile user interface.
- `backend/` or `RAS UI/RAS/backend/` - FastAPI backend for restaurant data and APIs.

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+
- Expo CLI (`npm install -g expo-cli`)

### Running the Mobile App

1. Navigate to the UI folder:
   ```sh
   cd "RAS UI/RAS"
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Expo development server:
   ```sh
   npm start
   ```
4. Scan the QR code with Expo Go on your phone.

### Running the Backend

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

## Features

- Restaurant discovery and search
- User and restaurant profile management
- Reservations, transactions, and deliveries
- Interactive map view

## Notes

- Make sure your phone and computer are on the same Wi-Fi for Expo Go.
- Backend API runs by default at `http://localhost:8000`.

---

For more details, see the code in [RAS UI/RAS/App.js](RAS%20UI/RAS/App.js) and backend routers in [backend/app/routers/](../backend/app/routers/).
