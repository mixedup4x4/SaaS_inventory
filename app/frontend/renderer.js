async function fetchInventory() {
    try {
        const response = await fetch("http://127.0.0.1:8000/items");
        const data = await response.json();

        console.log("🔍 API Response:", data);  // Debugging step

        const list = document.getElementById("inventory-list");
        list.innerHTML = "";
        let totalValue = 0;

        if (!data.items || data.items.length === 0) {
            console.warn("⚠️ No items in inventory.");
            list.innerHTML = "<tr><td colspan='4' class='text-center'>No items in inventory</td></tr>";
            document.getElementById("total-value").innerText = "$0.00";
            return;
        }

        data.items.forEach((item, index) => {
            if (!Array.isArray(item) || item.length < 4) {
                console.error(`❌ Invalid item format at index ${index}:`, item);
                return;
            }

            const itemId = item[0];
            const itemName = item[1];
            const itemQuantity = item[2];
            const itemPrice = item[3];

            console.log(`✅ Adding item: ID=${itemId}, Name=${itemName}, Quantity=${itemQuantity}, Price=${itemPrice}`);

            totalValue += itemQuantity * itemPrice;

            const row = document.createElement("tr");

            // ✅ FIX: Only add class if a condition is met
            if (itemQuantity <= 0) {
                row.classList.add("out-of-stock");
            } else if (itemQuantity < 5) {
                row.classList.add("low-stock");
            }

            row.innerHTML = `
                <td>${itemName}</td>
                <td>${itemQuantity}</td>
                <td>$${itemPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editItem(${itemId}, '${itemName}', ${itemQuantity}, ${itemPrice})">✏️ Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem(${itemId})">🗑️ Delete</button>
                </td>
            `;
            list.appendChild(row);
        });

        document.getElementById("total-value").innerText = `$${totalValue.toFixed(2)}`;
    } catch (error) {
        console.error("🚨 Error fetching inventory:", error);
    }
}

async function addItem() {
    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

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
                price: parseFloat(price)
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add item.");
        }

        fetchInventory(); // Refresh UI
    } catch (error) {
        console.error("Error adding item:", error);
    }
}

async function editItem(id, currentName, currentQuantity, currentPrice) {
    const updatedItem = await ipcRenderer.invoke("edit-item-dialog", {
        id,
        name: currentName,
        quantity: currentQuantity,
        price: currentPrice
    });

    if (!updatedItem || !updatedItem.name || isNaN(updatedItem.quantity) || isNaN(updatedItem.price)) {
        alert("Invalid input or cancelled.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem)
        });

        if (!response.ok) {
            throw new Error("Failed to update item.");
        }

        fetchInventory();
    } catch (error) {
        console.error("Error updating item:", error);
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

function filterInventory() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    document.querySelectorAll("#inventory-list tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(searchValue) ? "" : "none";
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function exportToCSV() {
    let csvContent = "Name,Quantity,Price\n";
    document.querySelectorAll("#inventory-list tr").forEach(row => {
        let cells = row.querySelectorAll("td");
        if (cells.length > 0) {
            csvContent += `${cells[0].innerText},${cells[1].innerText},${cells[2].innerText.replace("$", "")}\n`;
        }
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load inventory on startup
fetchInventory();
