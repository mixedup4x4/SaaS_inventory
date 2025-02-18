const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));
}

// Function to create the Edit Item modal
function openEditWindow(item) {
    return new Promise((resolve) => {
        const editWin = new BrowserWindow({
            width: 400,
            height: 300,
            modal: true,
            parent: BrowserWindow.getFocusedWindow(),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        editWin.loadFile(path.join(__dirname, "edit.html"));

        editWin.webContents.once("did-finish-load", () => {
            editWin.webContents.send("edit-data", item);
        });

        ipcMain.once("save-edit", (event, updatedItem) => {
            resolve(updatedItem);
            editWin.close();
        });
    });
}

ipcMain.handle("edit-item-dialog", async (event, item) => {
    const updatedItem = await openEditWindow(item);
    return updatedItem;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
