export const removeBismillah = (text: string, surahNumber: number, ayahNumber: number): string => {
  console.log(`[v0] removeBismillah called: surahNumber=${surahNumber}, ayahNumber=${ayahNumber}`)
  console.log(`[v0] Text: "${text.substring(0, 100)}"`)

  // Surahs 1 (Al-Fatihah) and 9 (At-Tawbah) are exceptions
  if (surahNumber === 1 || surahNumber === 9) {
    console.log(`[v0] Surah ${surahNumber} exception - returning text as is`)
    return text
  }

  // Remove Bismillah only from the first ayah of other surahs
  if (ayahNumber === 1) {
    console.log(`[v0] Processing first ayah of surah ${surahNumber}`)
    const normalizedText = text.trim()

    const removeDiacritics = (str: string): string => {
      return str
        .replace(/[\u064B-\u0652]/g, "") // Remove Arabic diacritics (Fathah, Dammah, Kasrah, etc.)
        .replace(/[\u0653-\u0659]/g, "") // Remove additional diacritics
        .replace(/[\u0657-\u0659]/g, "") // Remove more diacritics
        .replace(/[\u06D6-\u06ED]/g, "") // Remove all Arabic decorative marks
        .replace(/[\u0640]/g, "") // Remove Tatweel
        .replace(/[\u0670]/g, "") // Remove Alef above (ٰ)
        .replace(/[\u0671]/g, "\u0627") // Replace Alef Wasla (ٱ) with regular Alef (ا)
        .replace(/[\u0649]/g, "\u064A") // Replace Alef Maksura (ى) with Ya (ي)
        .replace(/[\u06CC]/g, "\u064A") // Replace Farsi Ya (ی) with Arabic Ya (ي)
        .replace(/[\u06BA]/g, "") // Remove Noon Ghunna (ں)
        .replace(/[\u06C1-\u06C2]/g, "\u0647") // Normalize He variations to ه
        .replace(/[\u200C-\u200E]/g, "") // Remove Zero-width characters
        .trim()
    }

    // Split text into words
    const words = normalizedText.split(/\s+/)
    console.log(`[v0] Split into ${words.length} words`)

    // Look for the pattern: بسم الله الرحمن الرحيم (4 words)
    if (words.length >= 4) {
      const first4Words = words.slice(0, 4).map(removeDiacritics)
      console.log(`[v0] First 4 words: ${first4Words.join(" | ")}`)

      // Check if these are the 4 words of Bismillah
      const expectedBismillah = ["بسم", "الله", "الرحمن", "الرحيم"]
      const isMatch = first4Words.every((word, idx) => word === expectedBismillah[idx])

      console.log(`[v0] Expected: ${expectedBismillah.join(" | ")}`)
      console.log(`[v0] Match result: ${isMatch}`)

      if (isMatch) {
        // Remove first 4 words and return the rest
        const result = words.slice(4).join(" ").trim()
        console.log(`[v0] Bismillah removed successfully. Result: "${result}"`)
        return result
      }
    }

    console.log(`[v0] No Bismillah found to remove`)
  } else {
    console.log(`[v0] Skipping - not first ayah (ayahNumber=${ayahNumber})`)
  }

  return text
}

export const extractBismillah = (text: string, surahNumber: number, ayahNumber: number): string | null => {
  const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ"

  // Don't extract Bismillah from Al-Fatihah (surah 1) or At-Tawbah (surah 9)
  if (surahNumber === 1 || surahNumber === 9) {
    return null
  }

  // Extract Bismillah only from the first ayah of other surahs
  if (ayahNumber === 1 && text.startsWith(bismillah)) {
    return bismillah
  }

  return null
}
