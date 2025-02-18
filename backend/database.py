import sqlite3

# Connect to SQLite database (creates file if not exists)
conn = sqlite3.connect("inventory.db")
cursor = conn.cursor()

# Create tables if they don't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL
    )
''')
conn.commit()
conn.close()
