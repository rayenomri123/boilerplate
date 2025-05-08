// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  chrome: ()    => process.versions.chrome,
  node: ()      => process.versions.node,
  electron: ()  => process.versions.electron,
  ping: ()      => ipcRenderer.invoke('ping')    // if you prefer ping here
});

contextBridge.exposeInMainWorld('updater', {
  onChecking: cb => ipcRenderer.on('update-checking', () => cb()),
  onAvailable: cb => ipcRenderer.on('update-available', (_e, info) => cb(info)),
  onNotAvailable: cb => ipcRenderer.on('update-not-available', () => cb()),
  onProgress: cb => ipcRenderer.on('download-progress', (_e, progress) => cb(progress)),
  onDownloaded: cb => ipcRenderer.on('update-downloaded', (_e, info) => cb(info)),
  download: () => ipcRenderer.invoke('download-update'),
  install: () => ipcRenderer.invoke('install-update')
});
