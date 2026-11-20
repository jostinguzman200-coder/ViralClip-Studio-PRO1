const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('viralclip', {
  pickVideo: () => ipcRenderer.invoke('pick-video'),
  exportClip: data => ipcRenderer.invoke('export-clip', data)
});
