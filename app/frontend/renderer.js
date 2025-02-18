const { ipcRenderer } = require('electron');

async function fetchInventory() {
    try {
        const response = await fetch("http://127.0.0.1:8000/items");
        const data = await response.json();
        const list = document.getElementById("inventory-list");
        list.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            list.innerHTML = "<tr><td colspan='7' class='text-center'>No items in inventory</td></tr>";
            return;
        }

        data.items.forEach(item => {
            const itemId = item[0];
            const itemName = item[1];
            const itemQuantity = item[2];
            const itemPrice = item[3];
            const itemType = item[4] || "N/A";
            const itemDescription = item[5] || "N/A";
            const unitOfMeasure = item[6] || "N/A";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${itemName}</td>
                <td>${itemQuantity}</td>
                <td>${itemType}</td>
                <td>${itemDescription}</td>
                <td>${unitOfMeasure}</td>
                <td>$${itemPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editItem(${itemId})">✏️ Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem(${itemId})">🗑️ Delete</button>
                </td>
            `;
            list.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching inventory:", error);
    }
}

async function addItem() {
    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;
    const itemType = document.getElementById("item-type").value;
    const description = document.getElementById("description").value;
    const unitOfMeasure = document.getElementById("unit-of-measure").value;

    if (!name || isNaN(quantity) || isNaN(price)) {
        alert("Please enter valid item details.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                item_type: itemType,
                description: description,
                unit_of_measure: unitOfMeasure
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add item.");
        }

        fetchInventory();
    } catch (error) {
        console.error("Error adding item:", error);
    }
}

async function deleteItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            await fetch(`http://127.0.0.1:8000/items/${id}`, { method: "DELETE" });
            fetchInventory();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }
}

// 🔍 Search Inventory
function filterInventory() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    document.querySelectorAll("#inventory-list tr").forEach(row => {
        const itemName = row.querySelector("td:first-child")?.innerText.toLowerCase() || "";
        row.style.display = itemName.includes(searchValue) ? "" : "none";
    });
}

// 🌙 Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save preference in localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.removeItem("dark-mode");
    }
}

// Apply dark mode preference on page load
window.onload = function() {
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
};


// Load inventory on startup
fetchInventory();
