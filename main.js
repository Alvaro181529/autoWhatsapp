const { app, BrowserWindow, ipcMain } = require("electron");

const { setMainMenu } = require("./menu.js");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
};

//setMainMenu();
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Escucha el evento desde el proceso de renderizado para abrir el cuadro de diálogo
ipcMain.handle("open-dialog", async (event, options) => {
  const { dialog } = require("electron");
  return await dialog.showOpenDialog(options);
});
