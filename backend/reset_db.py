import sqlite3

conn = sqlite3.connect("inventory.db")
cursor = conn.cursor()

# Create the inventory table if it doesn't exist
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

print("✅ Database reset complete! Table 'inventory' created.")
