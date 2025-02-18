from fastapi import APIRouter, HTTPException
import sqlite3
from models import Item

router = APIRouter()

# Fetch all items
@router.get("/items")
def get_items():
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inventory")
    items = cursor.fetchall()
    conn.close()
    return {"items": items}

# Add new item
@router.post("/items")
def add_item(item: Item):
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)", 
                   (item.name, item.quantity, item.price))
    conn.commit()
    conn.close()
    return {"message": "Item added successfully"}

# Edit an item
@router.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE inventory SET name=?, quantity=?, price=? WHERE id=?", 
                   (item.name, item.quantity, item.price, item_id))
    conn.commit()
    conn.close()
    return {"message": "Item updated successfully"}

# Delete an item
@router.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = sqlite3.connect("inventory.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM inventory WHERE id=?", (item_id,))
    conn.commit()
    conn.close()
    return {"message": "Item deleted successfully"}
