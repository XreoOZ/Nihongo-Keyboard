/**
 * Dictionary module: Offline database for common words + Jisho API online lookup
 */
const NihongoDictionary = {
  // Common Japanese words cache & curated meanings (ID & EN)
  localDatabase: {
    kamu: {
      kanji: '噛む',
      reading: 'かむ',
      jlpt: 'N4',
      meaning_id: 'Mengunyah / menggigit',
      meaning_en: 'To bite, to chew, to gnaw'
    },
    kami: {
      kanji: '神 / 髪 / 紙',
      reading: 'かみ',
      jlpt: 'N5',
      meaning_id: '1. Tuhan/Dewa (神)  2. Rambut (髪)  3. Kertas (紙)',
      meaning_en: '1. God/Deity (神)  2. Hair (髪)  3. Paper (紙)'
    },
    arigatou: {
      kanji: '有難う',
      reading: 'ありがとう',
      jlpt: 'Common',
      meaning_id: 'Terima kasih',
      meaning_en: 'Thank you, thanks'
    },
    nihon: {
      kanji: '日本',
      reading: 'にほん',
      jlpt: 'N5',
      meaning_id: 'Negara Jepang',
      meaning_en: 'Japan'
    },
    konnichiwa: {
      kanji: 'こんにちは',
      reading: 'こんにちは',
      jlpt: 'Common',
      meaning_id: 'Halo / Selamat siang',
      meaning_en: 'Hello, good afternoon'
    },
    sayounara: {
      kanji: 'さようなら',
      reading: 'さようなら',
      jlpt: 'Common',
      meaning_id: 'Selamat tinggal',
      meaning_en: 'Goodbye, farewell'
    },
    watashi: {
      kanji: '私',
      reading: 'わたし',
      jlpt: 'N5',
      meaning_id: 'Saya / Aku',
      meaning_en: 'I, me'
    },
    anata: {
      kanji: '貴方',
      reading: 'あなた',
      jlpt: 'N5',
      meaning_id: 'Kamu / Anda',
      meaning_en: 'You'
    },
    suki: {
      kanji: '好き',
      reading: 'すき',
      jlpt: 'N5',
      meaning_id: 'Suka / Gemar',
      meaning_en: 'Liked, fond of, favorite'
    },
    daisuki: {
      kanji: '大好き',
      reading: 'だいすき',
      jlpt: 'N5',
      meaning_id: 'Sangat suka / Cinta',
      meaning_en: 'Love, adore, really like'
    },
    kawaii: {
      kanji: '可愛い',
      reading: 'かわいい',
      jlpt: 'N5',
      meaning_id: 'Lucu / Imut / Cantik',
      meaning_en: 'Cute, adorable, lovely'
    },
    neko: {
      kanji: '猫',
      reading: 'ねこ',
      jlpt: 'N5',
      meaning_id: 'Kucing',
      meaning_en: 'Cat'
    },
    inu: {
      kanji: '犬',
      reading: 'いぬ',
      jlpt: 'N5',
      meaning_id: 'Anjing',
      meaning_en: 'Dog'
    },
    taberu: {
      kanji: '食べる',
      reading: 'たべる',
      jlpt: 'N5',
      meaning_id: 'Makan',
      meaning_en: 'To eat'
    },
    nomu: {
      kanji: '飲む',
      reading: 'のむ',
      jlpt: 'N5',
      meaning_id: 'Minum',
      meaning_en: 'To drink'
    },
    iku: {
      kanji: '行く',
      reading: 'いく',
      jlpt: 'N5',
      meaning_id: 'Pergi',
      meaning_en: 'To go'
    },
    kuru: {
      kanji: '来る',
      reading: 'くる',
      jlpt: 'N5',
      meaning_id: 'Datang',
      meaning_en: 'To come'
    },
    miru: {
      kanji: '見る',
      reading: 'みる',
      jlpt: 'N5',
      meaning_id: 'Melihat / Menonton',
      meaning_en: 'To see, to look, to watch'
    },
    kiku: {
      kanji: '聞く',
      reading: 'きく',
      jlpt: 'N5',
      meaning_id: 'Mendengar / Bertanya',
      meaning_en: 'To hear, to listen, to ask'
    },
    hanasu: {
      kanji: '話す',
      reading: 'はなす',
      jlpt: 'N5',
      meaning_id: 'Berbicara / Mengobrol',
      meaning_en: 'To speak, to talk'
    },
    shigoto: {
      kanji: '仕事',
      reading: 'しごと',
      jlpt: 'N5',
      meaning_id: 'Pekerjaan / Tugas',
      meaning_en: 'Job, work, business'
    },
    benkyou: {
      kanji: '勉強',
      reading: 'べんきょう',
      jlpt: 'N5',
      meaning_id: 'Belajar',
      meaning_en: 'Study, diligence'
    },
    okane: {
      kanji: 'お金',
      reading: 'おかね',
      jlpt: 'N5',
      meaning_id: 'Uang',
      meaning_en: 'Money'
    },
    jikan: {
      kanji: '時間',
      reading: 'じかん',
      jlpt: 'N5',
      meaning_id: 'Waktu / Jam',
      meaning_en: 'Time, hour'
    },
    tomodachi: {
      kanji: '友達',
      reading: 'ともだち',
      jlpt: 'N5',
      meaning_id: 'Teman / Sahabat',
      meaning_en: 'Friend, companion'
    },
    kokoro: {
      kanji: '心',
      reading: 'こころ',
      jlpt: 'N4',
      meaning_id: 'Hati / Jiwa / Pikiran',
      meaning_en: 'Heart, mind, spirit'
    },
    hashi: {
      kanji: '箸 / 橋 / 端',
      reading: 'はし',
      jlpt: 'N5',
      meaning_id: '1. Sumpit (箸)  2. Jembatan (橋)  3. Ujung (端)',
      meaning_en: '1. Chopsticks (箸)  2. Bridge (橋)  3. Edge (端)'
    },
    ame: {
      kanji: '雨 / 飴',
      reading: 'あめ',
      jlpt: 'N5',
      meaning_id: '1. Hujan (雨)  2. Permen (飴)',
      meaning_en: '1. Rain (雨)  2. Candy / Sweets (飴)'
    },
    hana: {
      kanji: '花 / 鼻',
      reading: 'はな',
      jlpt: 'N5',
      meaning_id: '1. Bunga (花)  2. Hidung (鼻)',
      meaning_en: '1. Flower (花)  2. Nose (鼻)'
    },
    mizu: {
      kanji: '水',
      reading: 'みず',
      jlpt: 'N5',
      meaning_id: 'Air',
      meaning_en: 'Water (cold/fresh)'
    },
    ocha: {
      kanji: 'お茶',
      reading: 'おちゃ',
      jlpt: 'N5',
      meaning_id: 'Teh Jepang / Teh hijau',
      meaning_en: 'Tea, green tea'
    },
    gohan: {
      kanji: 'ご飯',
      reading: 'ごはん',
      jlpt: 'N5',
      meaning_id: 'Nasi / Makanan',
      meaning_en: 'Cooked rice, meal'
    },
    senshu: {
      kanji: '先週 / 選手',
      reading: 'せんしゅう',
      jlpt: 'N5',
      meaning_id: '1. Minggu lalu (先週)  2. Atlet / Pemain (選手)',
      meaning_en: '1. Last week (先週)  2. Player / Athlete (選手)'
    },
    ai: {
      kanji: '愛',
      reading: 'あい',
      jlpt: 'N3',
      meaning_id: 'Cinta / Kasih sayang',
      meaning_en: 'Love, affection'
    }
  },

  /**
   * Search for word definition.
   * @param {string} romaji - Romaji query (e.g., 'kamu', 'kami')
   * @param {string} lang - 'id' or 'en'
   * @returns {Promise<{ kanji: string, reading: string, jlpt: string, meaning: string } | null>}
   */
  async search(romaji, lang = 'id') {
    if (!romaji || typeof romaji !== 'string') return null;
    const clean = romaji.toLowerCase().trim();
    if (!clean) return null;

    // 1. Check instant local dictionary first
    if (this.localDatabase[clean]) {
      const item = this.localDatabase[clean];
      return {
        kanji: item.kanji,
        reading: item.reading,
        jlpt: item.jlpt,
        meaning: lang === 'en' ? item.meaning_en : item.meaning_id
      };
    }

    // 2. Query online Jisho API via Electron IPC
    if (window.nihongoAPI && window.nihongoAPI.lookupWord) {
      try {
        const result = await window.nihongoAPI.lookupWord(clean);
        if (result) {
          return {
            kanji: result.kanji || result.reading,
            reading: result.reading,
            jlpt: result.jlpt || '',
            meaning: result.meaning || ''
          };
        }
      } catch (err) {
        console.warn('Online dictionary lookup failed:', err);
      }
    }

    return null;
  }
};

window.NihongoDictionary = NihongoDictionary;
