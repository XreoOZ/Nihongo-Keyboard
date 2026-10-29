const { app, BrowserWindow, ipcMain, clipboard, globalShortcut, screen } = require('electron');
const path = require('path');

// Disable GPU shader disk cache to avoid Windows file lock errors
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('no-sandbox');

let mainWindow = null;
let isExpanded = false;

// Dimensions
const BUBBLE_WIDTH = 64;
const BUBBLE_HEIGHT = 64;
const EXPANDED_WIDTH = 400;
const EXPANDED_HEIGHT = 175;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Initial position: Top-Right of the screen with margin
  const initialX = Math.round(screenWidth - BUBBLE_WIDTH - 28);
  const initialY = Math.round(screenHeight * 0.18);

  mainWindow = new BrowserWindow({
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
    x: initialX,
    y: initialY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Ensure window stays visible across workspaces
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function expandWindow() {
  if (!mainWindow || isExpanded) return;
  const bounds = mainWindow.getBounds();
  const primaryDisplay = screen.getDisplayMatching(bounds);
  const { x: workX, y: workY, width: workW, height: workH } = primaryDisplay.workArea;

  let newX = bounds.x;
  let newY = bounds.y;

  // If expanding pushes window off-screen to the right, pull it left
  if (newX + EXPANDED_WIDTH > workX + workW) {
    newX = workX + workW - EXPANDED_WIDTH - 12;
  }
  // If expanding pushes window off-screen to bottom, pull it up
  if (newY + EXPANDED_HEIGHT > workY + workH) {
    newY = workY + workH - EXPANDED_HEIGHT - 12;
  }

  isExpanded = true;
  mainWindow.setBounds({
    x: Math.round(newX),
    y: Math.round(newY),
    width: EXPANDED_WIDTH,
    height: EXPANDED_HEIGHT
  });

  mainWindow.webContents.send('action:toggle-expand', true);
  mainWindow.show();
  mainWindow.focus();
}

function collapseWindow() {
  if (!mainWindow || !isExpanded) return;
  const bounds = mainWindow.getBounds();

  isExpanded = false;
  mainWindow.setBounds({
    x: bounds.x,
    y: bounds.y,
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT
  });

  mainWindow.webContents.send('action:toggle-expand', false);
}

function toggleWindow() {
  if (isExpanded) {
    collapseWindow();
  } else {
    expandWindow();
  }
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  // Register Global Hotkey (Alt + J)
  const registered = globalShortcut.register('Alt+J', () => {
    toggleWindow();
  });

  if (!registered) {
    console.warn('Failed to register global shortcut Alt+J. Trying Ctrl+Shift+Space.');
    globalShortcut.register('CommandOrControl+Shift+Space', () => {
      toggleWindow();
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('window:expand', () => {
  expandWindow();
  return true;
});

ipcMain.handle('window:collapse', () => {
  collapseWindow();
  return true;
});

ipcMain.on('window:move-by', (_event, { deltaX, deltaY }) => {
  if (!mainWindow) return;
  const [currentX, currentY] = mainWindow.getPosition();
  mainWindow.setPosition(Math.round(currentX + deltaX), Math.round(currentY + deltaY));
});

ipcMain.handle('clipboard:copy', (_event, text) => {
  if (typeof text === 'string') {
    clipboard.writeText(text);
    return true;
  }
  return false;
});

ipcMain.handle('app:quit', () => {
  app.quit();
});
