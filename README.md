# 🌸 Nihongo Keyboard (Floating Overlay)

Aplikasi floating keyboard bahasa Jepang yang selalu melayang di atas semua jendela aplikasi (*Always-on-Top*), dengan konversi teks Latin (Romaji) ke Hiragana dan Katakana secara instan (*real-time*).

---

## 🚀 Fitur Utama

- **Always on Top & Melayang:** Tetap muncul di layar paling depan meskipun kamu sedang membuka game, browser, Word, Discord, atau aplikasi lainnya.
- **Draggable:** Bebas digeser ke posisi layar mana pun yang nyaman.
- **Morphing UI:**
  - **Mode Bubble (Idle):** Icon bulat kecil minimalis ber-kanji `日` yang tidak mengganggu pandangan layar.
  - **Mode Expanded (Input):** Mengembang menjadi bar input modern saat diklik atau dipicu via shortcut.
- **Konversi Real-Time:**
  - Ketik: `kamu` $\rightarrow$ Otomatis muncul **Hiragana (`かむ`)** dan **Katakana (`カム`)**.
  - Ketik: `arigatou` $\rightarrow$ `ありがとう` / `アリガトウ`.
  - Ketik: `nihon` $\rightarrow$ `にほん` / `ニホン`.
- **Shortcut Cepat Salin & Tutup:**
  - Tekan `Enter` $\rightarrow$ Salin **Hiragana** ke clipboard dan otomatis ciutkan kembali ke bubble.
  - Tekan `Shift + Enter` atau `Tab` $\rightarrow$ Salin **Katakana** ke clipboard.
  - Tekan `Esc` $\rightarrow$ Batalkan / ciutkan kembali ke bubble.
  - Klik kartu hasil $\rightarrow$ Salin hasil yang diklik.
- **Global Shortcut:** Tekan `Alt + J` dari mana saja di Windows untuk langsung membuka/menutup keyboard.

---

## 📁 Struktur Folder Project

```text
Nihongo Keyboard/
├── main.js                 # Electron Main Process (Lifecycle, Window, Global Hotkey, AlwaysOnTop)
├── preload.js              # Context Bridge aman antara Electron & Renderer
├── package.json            # Manifest & dependencies
├── README.md               # Dokumentasi project
└── src/
    ├── index.html          # Tampilan UI (Bubble & Expanded)
    ├── styles/
    │   └── style.css       # Styling tema gelap modern bernuansa Jepang
    └── scripts/
        ├── converter.js    # Modul wrapper konversi Romaji -> Kana
        ├── renderer.js     # Logika interaksi UI, event listener & keyboard shortcut
        └── wanakana.min.js # Engine konversi WanaKana
```

---

## 💻 Cara Menjalankan Aplikasi

Pastikan sudah berada di direktori project:
```bash
npm start
```
*(atau `npx electron .`)*

---

## ⌨️ Shortcut Cheat Sheet

| Shortcut | Aksi |
| :--- | :--- |
| **`Alt + J`** | Buka / Sembunyikan window dari aplikasi mana pun (*Global Hotkey*) |
| **`Enter`** | Salin hasil **Hiragana** ke clipboard & tutup ke bubble |
| **`Shift + Enter`** / **`Tab`** | Salin hasil **Katakana** ke clipboard & tutup ke bubble |
| **`Esc`** | Ciutkan kembali ke bubble tanpa menyalin |
