/**
 * Converter helper module that interfaces with WanaKana
 */
const NihongoConverter = {
  /**
   * Convert Romaji input into both Hiragana and Katakana.
   * @param {string} input - Raw text entered by the user.
   * @returns {{ hiragana: string, katakana: string, raw: string }}
   */
  convert(input) {
    if (!input || typeof input !== 'string') {
      return { hiragana: '', katakana: '', raw: '' };
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return { hiragana: '', katakana: '', raw: '' };
    }

    // Use global wanakana object loaded via script tag
    if (typeof wanakana !== 'undefined') {
      return {
        hiragana: wanakana.toHiragana(trimmed, { IMEMode: true }),
        katakana: wanakana.toKatakana(trimmed, { IMEMode: true }),
        raw: trimmed
      };
    }

    // Fallback if wanakana is not loaded
    return {
      hiragana: trimmed,
      katakana: trimmed,
      raw: trimmed
    };
  }
};

window.NihongoConverter = NihongoConverter;
