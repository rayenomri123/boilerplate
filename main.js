// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdates();

  // Relay autoUpdater events to renderer
  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update-checking');
  });
  autoUpdater.on('update-available', info => {
    mainWindow.webContents.send('update-available', info);
  });
  autoUpdater.on('update-not-available', info => {
    mainWindow.webContents.send('update-not-available', info);
  });
  autoUpdater.on('download-progress', progress => {
    mainWindow.webContents.send('download-progress', progress);
  });
  autoUpdater.on('update-downloaded', info => {
    mainWindow.webContents.send('update-downloaded', info);
  });

  // Handle UI requests
  ipcMain.handle('download-update', () => autoUpdater.downloadUpdate());
  ipcMain.handle('install-update', () => autoUpdater.quitAndInstall(true, true));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
