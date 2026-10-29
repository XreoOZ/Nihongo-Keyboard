const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nihongoAPI', {
  expandWindow: () => ipcRenderer.invoke('window:expand'),
  collapseWindow: () => ipcRenderer.invoke('window:collapse'),
  moveWindowBy: (deltaX, deltaY) => ipcRenderer.send('window:move-by', { deltaX, deltaY }),
  copyText: (text) => ipcRenderer.invoke('clipboard:copy', text),
  quitApp: () => ipcRenderer.invoke('app:quit'),
  updateGlobalShortcut: (shortcut) => ipcRenderer.invoke('shortcut:update', shortcut),
  getGlobalShortcut: () => ipcRenderer.invoke('shortcut:get'),
  onToggleExpand: (callback) => {
    ipcRenderer.on('action:toggle-expand', (_event, expanded) => callback(expanded));
  }
});
