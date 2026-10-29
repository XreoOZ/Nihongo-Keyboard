// DOM Elements
const appContainer = document.getElementById('app');
const bubbleView = document.getElementById('bubble-view');
const btnOpenBubble = document.getElementById('btn-open-bubble');
const btnMinimize = document.getElementById('btn-minimize');
const btnClose = document.getElementById('btn-close');
const btnSettings = document.getElementById('btn-settings');
const settingsPanel = document.getElementById('settings-panel');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnCancelSettings = document.getElementById('btn-cancel-settings');
const btnSaveSettings = document.getElementById('btn-save-settings');
const selectShortcut = document.getElementById('select-shortcut');
const pillLangId = document.getElementById('pill-lang-id');
const pillLangEn = document.getElementById('pill-lang-en');
const lblShortcutTag = document.getElementById('lbl-shortcut-tag');

// Mode Switcher Elements
const tabModeRomaji = document.getElementById('tab-mode-romaji');
const tabModeTranslate = document.getElementById('tab-mode-translate');
const lblTabRomaji = document.getElementById('lbl-tab-romaji');
const lblTabTranslate = document.getElementById('lbl-tab-translate');

const romajiInput = document.getElementById('romaji-input');
const btnClear = document.getElementById('btn-clear');
const cardHiragana = document.getElementById('card-hiragana');
const textHiragana = document.getElementById('text-hiragana');
const cardKatakana = document.getElementById('card-katakana');
const textKatakana = document.getElementById('text-katakana');
const toastMessage = document.getElementById('toast-message');

// Meaning / Dictionary Elements
const cardMeaning = document.getElementById('card-meaning');
const lblTagMeaning = document.getElementById('lbl-tag-meaning');
const lblMeaningBadge = document.getElementById('lbl-meaning-badge');
const wrapMeaningKanji = document.getElementById('wrap-meaning-kanji');
const textMeaningKanji = document.getElementById('text-meaning-kanji');
const lblKanjiHint = document.getElementById('lbl-kanji-hint');
const textMeaningDef = document.getElementById('text-meaning-def');

// Labels for localization
const lblAppTitle = document.getElementById('lbl-app-title');
const lblTagHiragana = document.getElementById('lbl-tag-hiragana');
const lblTagKatakana = document.getElementById('lbl-tag-katakana');
const lblHintHiragana = document.getElementById('lbl-hint-hiragana');
const lblHintKatakana = document.getElementById('lbl-hint-katakana');
const lblStatusTip = document.getElementById('lbl-status-tip');
const lblSettingsTitle = document.getElementById('lbl-settings-title');
const lblSettingLang = document.getElementById('lbl-setting-lang');
const lblSettingShortcut = document.getElementById('lbl-setting-shortcut');

let currentHiragana = '';
let currentKatakana = '';
let currentKanji = '';
let toastTimeout = null;
let searchDebounceTimeout = null;

// ==========================================
// Mode State: 'romaji' or 'translate'
// ==========================================
let currentMode = localStorage.getItem('nihongo_mode') || 'romaji';

function setMode(mode) {
  currentMode = mode;
  localStorage.setItem('nihongo_mode', mode);

  tabModeRomaji.classList.toggle('active', mode === 'romaji');
  tabModeTranslate.classList.toggle('active', mode === 'translate');

  const dict = window.I18N && window.I18N[currentLang] ? window.I18N[currentLang] : window.I18N['id'];
  if (romajiInput) {
    romajiInput.placeholder = mode === 'romaji' ? dict.inputPlaceholderRomaji : dict.inputPlaceholderTranslate;
  }

  updateConversion();
  setTimeout(() => {
    romajiInput.focus();
  }, 40);
}

// ==========================================
// Settings & Localization (i18n) State
// ==========================================
let currentLang = localStorage.getItem('nihongo_lang') || 'id';
let currentShortcut = localStorage.getItem('nihongo_shortcut') || 'Alt+J';
let selectedLangTemp = currentLang;

function formatShortcutLabel(shortcut) {
  if (shortcut === 'CommandOrControl+Shift+Space') return 'Ctrl+Shift+Space';
  return shortcut.replace(/\+/g, ' + ');
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('nihongo_lang', lang);

  const dict = window.I18N && window.I18N[lang] ? window.I18N[lang] : window.I18N['id'];
  if (!dict) return;

  if (lblAppTitle) lblAppTitle.textContent = dict.appTitle;
  if (lblTabRomaji) lblTabRomaji.textContent = dict.tabRomaji;
  if (lblTabTranslate) lblTabTranslate.textContent = dict.tabTranslate;

  if (romajiInput) {
    romajiInput.placeholder = currentMode === 'romaji' ? dict.inputPlaceholderRomaji : dict.inputPlaceholderTranslate;
  }

  if (lblTagHiragana) lblTagHiragana.textContent = dict.cardHiragana;
  if (lblTagKatakana) lblTagKatakana.textContent = dict.cardKatakana;
  if (lblHintHiragana) lblHintHiragana.textContent = dict.keyHintHiragana;
  if (lblHintKatakana) lblHintKatakana.textContent = dict.keyHintKatakana;
  if (lblStatusTip) lblStatusTip.innerHTML = dict.statusTip;

  if (lblTagMeaning) lblTagMeaning.textContent = dict.cardMeaning;
  if (lblKanjiHint) lblKanjiHint.textContent = dict.kanjiCopyHint;
  if (!romajiInput.value.trim() && textMeaningDef) {
    textMeaningDef.textContent = currentMode === 'romaji' ? dict.meaningPlaceholder : dict.meaningPlaceholderTranslate;
  }

  if (lblSettingsTitle) lblSettingsTitle.textContent = dict.settingsTitle;
  if (lblSettingLang) lblSettingLang.textContent = dict.langLabel;
  if (lblSettingShortcut) lblSettingShortcut.textContent = dict.shortcutLabel;
  if (btnCancelSettings) btnCancelSettings.textContent = dict.btnCancel;
  if (btnSaveSettings) btnSaveSettings.textContent = dict.btnSave;

  if (btnSettings) btnSettings.title = dict.settingsBtnTitle;
  if (btnMinimize) btnMinimize.title = dict.minimizeBtnTitle;
  if (btnClose) btnClose.title = dict.closeBtnTitle;
  if (btnClear) btnClear.title = dict.clearBtnTitle;

  pillLangId.classList.toggle('active', selectedLangTemp === 'id');
  pillLangEn.classList.toggle('active', selectedLangTemp === 'en');
}

// ==========================================
// Mode Switching (Bubble <-> Expanded)
// ==========================================
function setExpandedMode(expanded) {
  if (expanded) {
    appContainer.className = 'mode-expanded';
    setTimeout(() => {
      if (settingsPanel.classList.contains('settings-hidden')) {
        romajiInput.focus();
        romajiInput.select();
      }
    }, 60);
  } else {
    appContainer.className = 'mode-bubble';
    closeSettings();
  }
}

function requestExpand() {
  setExpandedMode(true);
  if (window.nihongoAPI) {
    window.nihongoAPI.expandWindow();
  }
}

function requestCollapse() {
  setExpandedMode(false);
  if (window.nihongoAPI) {
    window.nihongoAPI.collapseWindow();
  }
}

// ==========================================
// Settings Panel Control
// ==========================================
function openSettings() {
  selectedLangTemp = currentLang;
  pillLangId.classList.toggle('active', selectedLangTemp === 'id');
  pillLangEn.classList.toggle('active', selectedLangTemp === 'en');
  selectShortcut.value = currentShortcut;

  settingsPanel.classList.remove('settings-hidden');
}

function closeSettings() {
  settingsPanel.classList.add('settings-hidden');
  setTimeout(() => {
    romajiInput.focus();
  }, 50);
}

// ==========================================
// Smooth Bubble Drag vs Click System
// ==========================================
let isDraggingBubble = false;
let hasDragged = false;
let startScreenX = 0;
let startScreenY = 0;

bubbleView.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  isDraggingBubble = true;
  hasDragged = false;
  startScreenX = e.screenX;
  startScreenY = e.screenY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDraggingBubble) return;

  const dx = e.screenX - startScreenX;
  const dy = e.screenY - startScreenY;

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

  if (!hasDragged) {
    requestExpand();
  }
});

// ==========================================
// Toast Notification
// ==========================================
function showToast(message) {
  if (!toastMessage) return;
  toastMessage.textContent = message;
  toastMessage.classList.remove('toast-hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.classList.add('toast-hidden');
  }, 1300);
}

// ==========================================
// Conversion & Translation Logic
// ==========================================
function resetMeaningCard() {
  const dict = window.I18N && window.I18N[currentLang] ? window.I18N[currentLang] : window.I18N['id'];
  currentKanji = '';
  wrapMeaningKanji.style.display = 'none';
  lblMeaningBadge.style.display = 'none';
  textMeaningDef.textContent = currentMode === 'romaji' ? dict.meaningPlaceholder : dict.meaningPlaceholderTranslate;
}

function updateConversion() {
  const query = romajiInput.value;
  btnClear.style.display = query.length > 0 ? 'block' : 'none';

  if (!query.trim()) {
    currentHiragana = '';
    currentKatakana = '';
    textHiragana.textContent = '-';
    textKatakana.textContent = '-';
    resetMeaningCard();
    return;
  }

  const clean = query.trim().toLowerCase();

  // ----------------------------------------------------
  // MODE 1: ROMAJI -> KANA (Traditional Keyboard)
  // ----------------------------------------------------
  if (currentMode === 'romaji') {
    const result = window.NihongoConverter ? window.NihongoConverter.convert(query) : { hiragana: query, katakana: query };
    currentHiragana = result.hiragana;
    currentKatakana = result.katakana;

    textHiragana.textContent = currentHiragana || '-';
    textKatakana.textContent = currentKatakana || '-';

    if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(async () => {
      if (window.NihongoDictionary) {
        const match = await window.NihongoDictionary.search(clean, currentLang);
        if (match) {
          if (match.kanji && match.kanji !== '-') {
            currentKanji = match.kanji;
            textMeaningKanji.textContent = match.kanji;
            wrapMeaningKanji.style.display = 'inline-flex';
          } else {
            wrapMeaningKanji.style.display = 'none';
          }

          if (match.jlpt) {
            lblMeaningBadge.textContent = match.jlpt.startsWith('JLPT') ? match.jlpt : `JLPT ${match.jlpt}`;
            lblMeaningBadge.style.display = 'inline-block';
          } else {
            lblMeaningBadge.style.display = 'none';
          }

          textMeaningDef.textContent = match.meaning || '-';
        } else {
          const dict = window.I18N && window.I18N[currentLang] ? window.I18N[currentLang] : window.I18N['id'];
          wrapMeaningKanji.style.display = 'none';
          lblMeaningBadge.style.display = 'none';
          textMeaningDef.textContent = dict.meaningNotFound;
        }
      }
    }, 220);
  }

  // ----------------------------------------------------
  // MODE 2: TRANSLATE (ID / EN -> Japanese: e.g. "Kamu" -> "Anata")
  // ----------------------------------------------------
  else if (currentMode === 'translate') {
    const dict = window.I18N && window.I18N[currentLang] ? window.I18N[currentLang] : window.I18N['id'];
    textMeaningDef.textContent = dict.meaningLoading;

    if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(async () => {
      if (window.NihongoDictionary) {
        const trans = await window.NihongoDictionary.translate(clean);
        if (trans) {
          currentHiragana = trans.hiragana;
          currentKatakana = trans.katakana;
          currentKanji = trans.kanji;

          textHiragana.textContent = currentHiragana || '-';
          textKatakana.textContent = currentKatakana || '-';

          if (trans.kanji && trans.kanji !== '-') {
            textMeaningKanji.textContent = trans.kanji;
            wrapMeaningKanji.style.display = 'inline-flex';
          } else {
            wrapMeaningKanji.style.display = 'none';
          }

          lblMeaningBadge.style.display = 'none';

          const romajiBadge = trans.romaji ? `${trans.romaji.toUpperCase()} • ` : '';
          textMeaningDef.textContent = `${romajiBadge}${trans.meaning || clean}`;
        } else {
          textHiragana.textContent = '-';
          textKatakana.textContent = '-';
          wrapMeaningKanji.style.display = 'none';
          textMeaningDef.textContent = dict.meaningNotFound;
        }
      }
    }, 200);
  }
}

// ==========================================
// Clipboard Actions
// ==========================================
async function copyAndFinish(text) {
  if (!text || text === '-') return;

  if (window.nihongoAPI) {
    await window.nihongoAPI.copyText(text);
  } else {
    navigator.clipboard.writeText(text);
  }

  const dict = window.I18N && window.I18N[currentLang] ? window.I18N[currentLang] : window.I18N['id'];
  const msg = dict.toastCopied.replace('{text}', text);
  showToast(msg);

  setTimeout(() => {
    requestCollapse();
  }, 350);
}

// ==========================================
// Event Listeners
// ==========================================

// Mode Tabs Click
tabModeRomaji.addEventListener('click', () => setMode('romaji'));
tabModeTranslate.addEventListener('click', () => setMode('translate'));

// Click Kanji badge to copy
wrapMeaningKanji.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentKanji) {
    const primaryKanji = currentKanji.split('/')[0].trim();
    copyAndFinish(primaryKanji);
  }
});

// Settings triggers
btnSettings.addEventListener('click', (e) => {
  e.stopPropagation();
  if (settingsPanel.classList.contains('settings-hidden')) {
    openSettings();
  } else {
    closeSettings();
  }
});

btnCloseSettings.addEventListener('click', (e) => {
  e.stopPropagation();
  closeSettings();
});

btnCancelSettings.addEventListener('click', (e) => {
  e.stopPropagation();
  closeSettings();
});

// Language Pills Click
pillLangId.addEventListener('click', () => {
  selectedLangTemp = 'id';
  pillLangId.classList.add('active');
  pillLangEn.classList.remove('active');
});

pillLangEn.addEventListener('click', () => {
  selectedLangTemp = 'en';
  pillLangEn.classList.add('active');
  pillLangId.classList.remove('active');
});

// Save Settings
btnSaveSettings.addEventListener('click', async (e) => {
  e.stopPropagation();

  applyLanguage(selectedLangTemp);
  updateConversion();

  const newShortcut = selectShortcut.value;
  if (newShortcut !== currentShortcut && window.nihongoAPI && window.nihongoAPI.updateGlobalShortcut) {
    const success = await window.nihongoAPI.updateGlobalShortcut(newShortcut);
    if (success) {
      currentShortcut = newShortcut;
      localStorage.setItem('nihongo_shortcut', newShortcut);
      lblShortcutTag.textContent = formatShortcutLabel(newShortcut);
    } else {
      const dict = window.I18N[currentLang];
      showToast(dict.toastShortcutFailed);
      return;
    }
  }

  closeSettings();
  const dict = window.I18N[currentLang];
  showToast(dict.toastSaved);
});

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
  // Ctrl + T -> Toggle between Romaji and Translate modes!
  if (e.ctrlKey && e.key.toLowerCase() === 't') {
    e.preventDefault();
    setMode(currentMode === 'romaji' ? 'translate' : 'romaji');
    return;
  }

  if (e.key === 'Escape') {
    e.preventDefault();
    requestCollapse();
    return;
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    if (currentKatakana && currentKatakana !== '-') {
      copyAndFinish(currentKatakana);
    }
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    if (e.shiftKey) {
      if (currentKatakana && currentKatakana !== '-') copyAndFinish(currentKatakana);
    } else {
      if (currentHiragana && currentHiragana !== '-') copyAndFinish(currentHiragana);
    }
  }
});

cardHiragana.addEventListener('click', () => {
  if (currentHiragana && currentHiragana !== '-') copyAndFinish(currentHiragana);
});

cardKatakana.addEventListener('click', () => {
  if (currentKatakana && currentKatakana !== '-') copyAndFinish(currentKatakana);
});

// Shortcut toggle listener from Main
if (window.nihongoAPI && window.nihongoAPI.onToggleExpand) {
  window.nihongoAPI.onToggleExpand((expanded) => {
    setExpandedMode(expanded);
  });
}

// Initial initialization
(async function init() {
  applyLanguage(currentLang);
  setMode(currentMode);

  if (window.nihongoAPI && window.nihongoAPI.getGlobalShortcut) {
    const activeShortcut = await window.nihongoAPI.getGlobalShortcut();
    if (activeShortcut) {
      currentShortcut = activeShortcut;
      selectShortcut.value = activeShortcut;
      lblShortcutTag.textContent = formatShortcutLabel(activeShortcut);
    }
  }
})();
