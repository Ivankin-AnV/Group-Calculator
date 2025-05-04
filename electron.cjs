const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createMainWindow);

ipcMain.on('go-to-game', () => {
  if (mainWindow) {
    const gamePagePath = path.join(__dirname, 'public/dino/dino.html');
    mainWindow.loadFile(gamePagePath)
      .then(() => console.log('Game page loaded'))
      .catch((err) => console.error('Error loading game page:', err));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
