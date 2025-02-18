# SaaS Inventory System

📦 **A cross-platform inventory management system** designed for small businesses and self-employed artisans.  
Easily track **inventory, recipes, invoices, and finances** in one place. Built with **FastAPI (backend) & Electron (frontend).**

---

## 🚀 Features
✅ **Inventory Management**: Track items, quantities, and costs  
✅ **Unit of Measure Tracking**: Helps with recipe and cost breakdown  
✅ **Dark Mode**: Toggle between light & dark themes  
✅ **Stock Alerts**: Highlights low/out-of-stock items  
✅ **Export to CSV**: Download inventory reports  
✅ **Real-Time Search**: Quickly find items  

---

## 📌 Installation

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/YOUR_USERNAME/SaaS_inventory.git
cd SaaS_inventory

Backend (FastAPI) Setup
cd backend
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload

Frontend (Electron) Setup
cd app/frontend
npm install
npx electron main.js

⚖️ License

This project is licensed under the MIT License. See LICENSE for details.

