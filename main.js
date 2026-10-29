const { app, BrowserWindow, ipcMain, clipboard, globalShortcut, screen } = require('electron');
const path = require('path');

// Suppress internal Chromium/GPU driver noise & cache locks
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-direct-composition-video-overlays');
app.commandLine.appendSwitch('log-level', '3');
app.commandLine.appendSwitch('no-sandbox');

let mainWindow = null;
let isExpanded = false;
let currentShortcut = 'Alt+J';
const dictionaryCache = new Map();
const translationCache = new Map();

// Helper to normalize macron vowels from romanization
function normalizeMacrons(str) {
  if (!str) return '';
  return str
    .replace(/[āĀ]/g, 'aa')
    .replace(/[īĪ]/g, 'ii')
    .replace(/[ūŪ]/g, 'uu')
    .replace(/[ēĒ]/g, 'ee')
    .replace(/[ōŌ]/g, 'ou');
}

// Curated local translation dictionary for instant offline responses
const localTranslationMap = {
  kamu: { romaji: 'anata', hiragana: 'あなた', katakana: 'アナタ', kanji: '貴方', meaning: 'Kamu / Anda (You)' },
  anda: { romaji: 'anata', hiragana: 'あなた', katakana: 'アナタ', kanji: '貴方', meaning: 'Anda / Kamu (You)' },
  you: { romaji: 'anata', hiragana: 'あなた', katakana: 'アナタ', kanji: '貴方', meaning: 'You (Kamu / Anda)' },
  saya: { romaji: 'watashi', hiragana: 'わたし', katakana: 'ワタシ', kanji: '私', meaning: 'Saya / Aku (I, me)' },
  aku: { romaji: 'watashi', hiragana: 'わたし', katakana: 'ワタシ', kanji: '私', meaning: 'Aku / Saya (I, me)' },
  i: { romaji: 'watashi', hiragana: 'わたし', katakana: 'ワタシ', kanji: '私', meaning: 'I / Me (Saya / Aku)' },
  'terima kasih': { romaji: 'arigatou', hiragana: 'ありがとう', katakana: 'アリガトウ', kanji: '有難う', meaning: 'Terima kasih (Thank you)' },
  makasih: { romaji: 'arigatou', hiragana: 'ありがとう', katakana: 'アリガトウ', kanji: '有難う', meaning: 'Terima kasih (Thank you)' },
  'thank you': { romaji: 'arigatou', hiragana: 'ありがとう', katakana: 'アリガトウ', kanji: '有難う', meaning: 'Thank you (Terima kasih)' },
  thanks: { romaji: 'arigatou', hiragana: 'ありがとう', katakana: 'アリガトウ', kanji: '有難う', meaning: 'Thanks (Terima kasih)' },
  makan: { romaji: 'taberu', hiragana: 'たべる', katakana: 'タベル', kanji: '食べる', meaning: 'Makan (To eat)' },
  eat: { romaji: 'taberu', hiragana: 'たべる', katakana: 'タベル', kanji: '食べる', meaning: 'To eat (Makan)' },
  minum: { romaji: 'nomu', hiragana: 'のむ', katakana: 'ノム', kanji: '飲む', meaning: 'Minum (To drink)' },
  drink: { romaji: 'nomu', hiragana: 'のむ', katakana: 'ノム', kanji: '飲む', meaning: 'To drink (Minum)' },
  cinta: { romaji: 'ai', hiragana: 'あい', katakana: 'アイ', kanji: '愛', meaning: 'Cinta / Kasih sayang (Love)' },
  love: { romaji: 'ai', hiragana: 'あい', katakana: 'アイ', kanji: '愛', meaning: 'Love (Cinta)' },
  kucing: { romaji: 'neko', hiragana: 'ねこ', katakana: 'ネコ', kanji: '猫', meaning: 'Kucing (Cat)' },
  cat: { romaji: 'neko', hiragana: 'ねこ', katakana: 'ネコ', kanji: '猫', meaning: 'Cat (Kucing)' }
};

// Dimensions
const BUBBLE_WIDTH = 64;
const BUBBLE_HEIGHT = 64;
const EXPANDED_WIDTH = 420;
const EXPANDED_HEIGHT = 285;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

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

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerShortcut(newShortcut) {
  try {
    if (currentShortcut && globalShortcut.isRegistered(currentShortcut)) {
      globalShortcut.unregister(currentShortcut);
    }

    const registered = globalShortcut.register(newShortcut, () => {
      toggleWindow();
    });

    if (registered) {
      currentShortcut = newShortcut;
      return true;
    }

    if (newShortcut !== 'Alt+J') {
      globalShortcut.register('Alt+J', () => toggleWindow());
      currentShortcut = 'Alt+J';
    }
    return false;
  } catch (err) {
    console.error('Error registering global shortcut:', err);
    return false;
  }
}

function expandWindow() {
  if (!mainWindow || isExpanded) return;
  const bounds = mainWindow.getBounds();
  const primaryDisplay = screen.getDisplayMatching(bounds);
  const { x: workX, y: workY, width: workW, height: workH } = primaryDisplay.workArea;

  let newX = bounds.x;
  let newY = bounds.y;

  if (newX + EXPANDED_WIDTH > workX + workW) {
    newX = workX + workW - EXPANDED_WIDTH - 12;
  }
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

  registerShortcut(currentShortcut);

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

ipcMain.handle('shortcut:get', () => {
  return currentShortcut;
});

ipcMain.handle('shortcut:update', (_event, newShortcut) => {
  if (!newShortcut || typeof newShortcut !== 'string') return false;
  return registerShortcut(newShortcut);
});

// Online Jisho API Lookup with in-memory caching
ipcMain.handle('dictionary:lookup', async (_event, keyword) => {
  if (!keyword || typeof keyword !== 'string') return null;
  const clean = keyword.toLowerCase().trim();
  if (dictionaryCache.has(clean)) {
    return dictionaryCache.get(clean);
  }

  try {
    const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.data || json.data.length === 0) return null;

    const entry = json.data[0];
    const jp = entry.japanese && entry.japanese[0] ? entry.japanese[0] : {};
    const senses = entry.senses && entry.senses[0] ? entry.senses[0] : {};

    const result = {
      kanji: jp.word || jp.reading || '',
      reading: jp.reading || '',
      jlpt: (entry.jlpt && entry.jlpt[0]) ? entry.jlpt[0].replace('jlpt-', '').toUpperCase() : '',
      meaning: (senses.english_definitions && senses.english_definitions.length > 0)
        ? senses.english_definitions.slice(0, 3).join(', ')
        : ''
    };

    dictionaryCache.set(clean, result);
    return result;
  } catch (err) {
    console.error('Dictionary API lookup error:', err.message);
    return null;
  }
});

// Translation to Japanese API (supports Indonesian, English, etc.)
ipcMain.handle('translate:to-japanese', async (_event, text) => {
  if (!text || typeof text !== 'string') return null;
  const clean = text.toLowerCase().trim();
  if (!clean) return null;

  // 1. Check local translation cache or curated map
  if (localTranslationMap[clean]) {
    return localTranslationMap[clean];
  }
  if (translationCache.has(clean)) {
    return translationCache.get(clean);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&dt=rm&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data[0] || !data[0][0]) return null;

    const jaText = data[0][0][0] || '';
    const rawRomaji = data[0][1] ? data[0][1][2] : '';
    const romaji = normalizeMacrons(rawRomaji).toLowerCase().trim();

    // Check if jaText is purely Kana or has Kanji
    const hasKanji = /[\u4e00-\u9faf]/.test(jaText);

    // If word is "kamu", special case for kanji "貴方"
    let kanji = hasKanji ? jaText : '';
    if (clean === 'kamu' || clean === 'anda' || clean === 'you') {
      kanji = '貴方';
    }

    const result = {
      original: clean,
      jaText,
      romaji: romaji || clean,
      kanji: kanji || jaText,
      meaning: `${clean.charAt(0).toUpperCase() + clean.slice(1)}`
    };

    translationCache.set(clean, result);
    return result;
  } catch (err) {
    console.error('Translate API error:', err.message);
    return null;
  }
});

ipcMain.handle('app:quit', () => {
  app.quit();
});
