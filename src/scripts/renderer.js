// DOM Elements
const appContainer = document.getElementById('app');
const bubbleView = document.getElementById('bubble-view');
const btnOpenBubble = document.getElementById('btn-open-bubble');
const btnMinimize = document.getElementById('btn-minimize');
const btnClose = document.getElementById('btn-close');
const romajiInput = document.getElementById('romaji-input');
const btnClear = document.getElementById('btn-clear');
const cardHiragana = document.getElementById('card-hiragana');
const textHiragana = document.getElementById('text-hiragana');
const cardKatakana = document.getElementById('card-katakana');
const textKatakana = document.getElementById('text-katakana');
const toastMessage = document.getElementById('toast-message');

let currentHiragana = '';
let currentKatakana = '';
let toastTimeout = null;

// ==========================================
// Mode Switching
// ==========================================
function setExpandedMode(expanded) {
  if (expanded) {
    appContainer.className = 'mode-expanded';
    setTimeout(() => {
      romajiInput.focus();
      romajiInput.select();
    }, 60);
  } else {
    appContainer.className = 'mode-bubble';
  }
}

// Request main process to expand
function requestExpand() {
  setExpandedMode(true);
  if (window.nihongoAPI) {
    window.nihongoAPI.expandWindow();
  }
}

// Request main process to collapse
function requestCollapse() {
  setExpandedMode(false);
  if (window.nihongoAPI) {
    window.nihongoAPI.collapseWindow();
  }
}

// ==========================================
// Smooth Bubble Drag vs Click System
// ==========================================
let isDraggingBubble = false;
let hasDragged = false;
let startScreenX = 0;
let startScreenY = 0;

bubbleView.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; // Left mouse button only
  isDraggingBubble = true;
  hasDragged = false;
  startScreenX = e.screenX;
  startScreenY = e.screenY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDraggingBubble) return;

  const dx = e.screenX - startScreenX;
  const dy = e.screenY - startScreenY;

  // Threshold of 3px to differentiate drag from click
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    hasDragged = true;
  }

  if (hasDragged && (dx !== 0 || dy !== 0)) {
    if (window.nihongoAPI && window.nihongoAPI.moveWindowBy) {
      window.nihongoAPI.moveWindowBy(dx, dy);
    }
    startScreenX = e.screenX;
    startScreenY = e.screenY;
  }
});

window.addEventListener('mouseup', (e) => {
  if (!isDraggingBubble) return;
  isDraggingBubble = false;

  // If moved < 3px, treat as pure click to open!
  if (!hasDragged) {
    requestExpand();
  }
});

// ==========================================
// Toast Notification
// ==========================================
function showToast(message = '✓ Tersalin ke Clipboard!') {
  if (!toastMessage) return;
  toastMessage.textContent = message;
  toastMessage.classList.remove('toast-hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.classList.add('toast-hidden');
  }, 1200);
}

// ==========================================
// Conversion Logic
// ==========================================
function updateConversion() {
  const query = romajiInput.value;
  btnClear.style.display = query.length > 0 ? 'block' : 'none';

  if (!query.trim()) {
    currentHiragana = '';
    currentKatakana = '';
    textHiragana.textContent = '-';
    textKatakana.textContent = '-';
    return;
  }

  const result = window.NihongoConverter ? window.NihongoConverter.convert(query) : { hiragana: query, katakana: query };
  currentHiragana = result.hiragana;
  currentKatakana = result.katakana;

  textHiragana.textContent = currentHiragana || '-';
  textKatakana.textContent = currentKatakana || '-';
}

// ==========================================
// Clipboard & Output Actions
// ==========================================
async function copyAndFinish(text) {
  if (!text || text === '-') return;

  if (window.nihongoAPI) {
    await window.nihongoAPI.copyText(text);
  } else {
    navigator.clipboard.writeText(text);
  }

  showToast(`✓ "${text}" tersalin!`);

  // Auto collapse back to bubble after brief visual feedback
  setTimeout(() => {
    requestCollapse();
  }, 350);
}

// ==========================================
// Event Listeners (Expanded UI)
// ==========================================

// Header controls
btnMinimize.addEventListener('click', (e) => {
  e.stopPropagation();
  requestCollapse();
});

btnClose.addEventListener('click', (e) => {
  e.stopPropagation();
  if (window.nihongoAPI) {
    window.nihongoAPI.quitApp();
  }
});

// Clear input
btnClear.addEventListener('click', (e) => {
  e.stopPropagation();
  romajiInput.value = '';
  updateConversion();
  romajiInput.focus();
});

// Live input conversion
romajiInput.addEventListener('input', () => {
  updateConversion();
});

// Keyboard navigation
romajiInput.addEventListener('keydown', (e) => {
  // ESC -> Collapse
  if (e.key === 'Escape') {
    e.preventDefault();
    requestCollapse();
    return;
  }

  // TAB -> Copy Katakana
  if (e.key === 'Tab') {
    e.preventDefault();
    if (currentKatakana) {
      copyAndFinish(currentKatakana);
    }
    return;
  }

  // ENTER -> Check Shift key
  if (e.key === 'Enter') {
    e.preventDefault();
    if (e.shiftKey) {
      // Shift + Enter -> Katakana
      if (currentKatakana) copyAndFinish(currentKatakana);
    } else {
      // Enter -> Hiragana
      if (currentHiragana) copyAndFinish(currentHiragana);
    }
  }
});

// Click result cards to copy
cardHiragana.addEventListener('click', () => {
  if (currentHiragana) copyAndFinish(currentHiragana);
});

cardKatakana.addEventListener('click', () => {
  if (currentKatakana) copyAndFinish(currentKatakana);
});

// Listen for global shortcut toggle from Main process
if (window.nihongoAPI && window.nihongoAPI.onToggleExpand) {
  window.nihongoAPI.onToggleExpand((expanded) => {
    setExpandedMode(expanded);
  });
}
