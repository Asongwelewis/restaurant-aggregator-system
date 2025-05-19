import sqlite3
from datetime import datetime

#  USER MANAGEMENT DATABASE (user_management.db)
def init_user_db():
    conn = sqlite3.connect('user_management.db')
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS User (
            user_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            address_id INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS Address (
            address_id INTEGER PRIMARY KEY AUTOINCREMENT,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            coordinates TEXT  -- JSON: {"lat": 40.7128, "lng": -74.0060}
        );
        
        CREATE TABLE IF NOT EXISTS RegisteredUser (
            user_id TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            dietary_preferences TEXT,
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );
        
        CREATE TABLE IF NOT EXISTS AuthSession (
            session_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );
    ''')
    conn.commit()
    conn.close()

# RESTAURANT DATABASE (restaurant.db)
def init_restaurant_db():
    conn = sqlite3.connect('restaurant.db')
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS Restaurant (
            restaurant_id TEXT PRIMARY KEY,
            owner_id TEXT NOT NULL,
            name TEXT NOT NULL,
            cuisine_type TEXT NOT NULL,
            rating REAL DEFAULT 0.0,
            operating_hours TEXT,  -- JSON: {"mon": "9-17", "tue": "9-17"}
            address_id INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS MenuItem (
            item_id TEXT PRIMARY KEY,
            restaurant_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            dietary_info TEXT,
            is_available BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id)
        );
    ''')
    conn.commit()
    conn.close()

# BOOKING DATABASE (booking.db)
def init_booking_db():
    conn = sqlite3.connect('booking.db')
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS Booking (
            booking_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            restaurant_id TEXT NOT NULL,
            date_time TEXT NOT NULL,  -- ISO8601
            party_size INTEGER NOT NULL,
            status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending'
        );
        
        CREATE TABLE IF NOT EXISTS Payment (
            payment_id TEXT PRIMARY KEY,
            booking_id TEXT NOT NULL,
            amount REAL NOT NULL,
            method TEXT NOT NULL,
            status TEXT NOT NULL,
            transaction_date TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
        );
    ''')
    conn.commit()
    conn.close()

# 4. MARKETING DATABASE (marketing.db)
def init_marketing_db():
    conn = sqlite3.connect('marketing.db')
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS AdCampaign (
            campaign_id TEXT PRIMARY KEY,
            restaurant_id TEXT NOT NULL,
            budget REAL NOT NULL,
            target_radius INTEGER NOT NULL,
            duration_days INTEGER NOT NULL,
            start_date TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS CampaignMetrics (
            metrics_id TEXT PRIMARY KEY,
            campaign_id TEXT NOT NULL,
            date TEXT NOT NULL,
            impressions INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            conversions INTEGER DEFAULT 0,
            FOREIGN KEY (campaign_id) REFERENCES AdCampaign(campaign_id)
        );
    ''')
    conn.commit()
    conn.close()

# REVIEWS DATABASE (reviews.db)
def init_reviews_db():
    conn = sqlite3.connect('reviews.db')
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS Review (
            review_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            restaurant_id TEXT NOT NULL,
            rating INTEGER CHECK(rating BETWEEN 1 AND 5),
            comment TEXT,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS Photo (
            photo_id TEXT PRIMARY KEY,
            review_id TEXT NOT NULL,
            url TEXT NOT NULL,
            FOREIGN KEY (review_id) REFERENCES Review(review_id)
        );
    ''')
    conn.commit()
    conn.close()

def initialize_all_databases():
    init_user_db()
    init_restaurant_db()
    init_booking_db()
    init_marketing_db()
    init_reviews_db()
    print("All 5 databases initialized successfully!")

if __name__ == '__main__':
    initialize_all_databases()