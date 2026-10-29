# 🌸 Nihongo Keyboard (Floating Overlay)

Aplikasi floating keyboard bahasa Jepang yang selalu melayang di atas semua jendela aplikasi (*Always-on-Top*), dengan konversi teks Latin (Romaji) ke Hiragana dan Katakana secara instan (*real-time*), kamus arti kata terintegrasi, serta **Mode Terjemahan Bahasa Lain (ID/EN $\rightarrow$ Jepang)**.

---

## 🚀 Fitur Utama

- **Always on Top & Melayang:** Tetap muncul di layar paling depan meskipun kamu sedang membuka game, browser, Word, Discord, atau aplikasi lainnya.
- **Draggable:** Bebas digeser ke posisi layar mana pun yang nyaman.
- **Morphing UI:**
  - **Mode Bubble (Idle):** Icon bulat kecil minimalis ber-kanji `日` yang tidak mengganggu pandangan layar.
  - **Mode Expanded (Input):** Mengembang menjadi bar input modern saat diklik atau dipicu via shortcut.
- **🔄 Dual Input Mode (Ganti Mode via Klik atau `Ctrl + T`):**
  - **🔤 Romaji Mode:** Ketik pelafalan Jepang $\rightarrow$ otomatis jadi Kana & arti kata:
    - Ketik: `arigatou` $\rightarrow$ `ありがとう` / `アリガトウ` + Kanji `有難う`.
  - **🌐 Translate Mode (Bahasa Lain $\rightarrow$ Jepang):**
    - Ketik: `kamu` (Bahasa Indonesia) $\rightarrow$ Otomatis muncul:
      - **Hiragana:** `あなた`
      - **Katakana:** `アナタ`
      - **Kanji:** `貴方`
      - **Romaji & Makna:** `ANATA • Kamu / Anda (You)`
    - Ketik: `terima kasih` $\rightarrow$ `ありがとう` / `アリガトウ` + `有難う`
    - Ketik: `makan` $\rightarrow$ `たべる` / `タベル` + `食べる`
    - Ketik: `cinta` $\rightarrow$ `あい` / `アイ` + `愛`
- **📖 Layar Arti Kata & Kanji (Meaning Screen):**
  - Menampilkan padanan **Kanji** (misal `貴方`, `噛む`, `日本`, `有難う`).
  - **Klik badge Kanji** untuk langsung menyalin Kanji ke clipboard!
  - Menampilkan badge level **JLPT** (N5 - N1 / Common).
- **Shortcut Cepat Salin & Tutup:**
  - Tekan `Enter` $\rightarrow$ Salin **Hiragana** ke clipboard dan otomatis ciutkan kembali ke bubble.
  - Tekan `Shift + Enter` atau `Tab` $\rightarrow$ Salin **Katakana** ke clipboard.
  - Tekan `Esc` $\rightarrow$ Batalkan / ciutkan kembali ke bubble.
  - Tekan `Ctrl + T` $\rightarrow$ Beralih cepat antara **Romaji Mode** $\leftrightarrow$ **Translate Mode**.
- **⚙️ Settings & Dukungan Multibahasa (EN / ID):**
  - Ubah bahasa tampilan antarmuka antara **Bahasa Indonesia 🇮🇩** atau **English 🇬🇧**.
  - Kustomisasi tombol **Global Shortcut** langsung dari menu Settings (`Alt + J`, `Ctrl + Shift + Space`, `Alt + K`, dll).

---

## 📁 Struktur Folder Project

```text
Nihongo Keyboard/
├── main.js                 # Electron Main Process (Lifecycle, Window, Translation & Jisho IPC)
├── preload.js              # Context Bridge aman antara Electron & Renderer
├── package.json            # Manifest & dependencies
├── README.md               # Dokumentasi project
└── src/
    ├── index.html          # Tampilan UI (Bubble, Mode Switcher, Input, Meaning & Settings)
    ├── styles/
    │   └── style.css       # Desain Glassmorphism & efek modern
    └── scripts/
        ├── i18n.js         # Modul kamus multibahasa UI (ID / EN)
        ├── dictionary.js   # Modul kamus arti kata & pipeline terjemahan
        ├── converter.js    # Modul wrapper konversi Romaji -> Kana
        ├── renderer.js     # Logika interaksi UI, debouncing, & event listener
        └── wanakana.min.js # Engine konversi WanaKana
```

---

## 💻 Cara Menjalankan Aplikasi

Pastikan sudah berada di direktori project:
```bash
npm start
```
*(atau double-click file `run.bat`)*

---

## ⌨️ Shortcut Cheat Sheet

| Shortcut | Aksi |
| :--- | :--- |
| **`Alt + J`** *(Bisa diubah di Settings)* | Buka / Sembunyikan window dari aplikasi mana pun (*Global Hotkey*) |
| **`Ctrl + T`** | Ganti Mode (*Romaji Mode* $\leftrightarrow$ *Translate Mode*) |
| **`Enter`** | Salin hasil **Hiragana** ke clipboard & tutup ke bubble |
| **`Shift + Enter`** / **`Tab`** | Salin hasil **Katakana** ke clipboard & tutup ke bubble |
| **`Esc`** | Ciutkan kembali ke bubble tanpa menyalin |

---

## 📜 Lisensi

Didistribusikan di bawah lisensi **GNU General Public License v3.0 (GPLv3)**. Lihat file `LICENSE` untuk informasi lebih lanjut.
