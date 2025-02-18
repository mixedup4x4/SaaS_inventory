from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import sqlite3

app = FastAPI()

conn = sqlite3.connect("inventory.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    item_type TEXT,
    description TEXT,
    unit_of_measure TEXT
)
""")
conn.commit()

class Item(BaseModel):
    name: str
    quantity: int
    price: float
    item_type: Optional[str] = None
    description: Optional[str] = None
    unit_of_measure: Optional[str] = None

@app.get("/items")
def get_items():
    cursor.execute("SELECT * FROM items")
    items = cursor.fetchall()
    return {"items": items}

@app.post("/items")
def add_item(item: Item):
    cursor.execute("INSERT INTO items (name, quantity, price, item_type, description, unit_of_measure) VALUES (?, ?, ?, ?, ?, ?)",
                   (item.name, item.quantity, item.price, item.item_type, item.description, item.unit_of_measure))
    conn.commit()
    return {"message": "Item added successfully"}
