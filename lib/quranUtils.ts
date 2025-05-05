export const removeBismillah = (text: string, surahNumber: number, ayahNumber: number): string => {
  const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ"

  // Jangan hapus Bismillah dari Al-Fatihah (surah nomor 1)
  if (surahNumber === 1) {
    return text
  }

  // Hapus Bismillah hanya dari ayat pertama surah lainnya
  if (ayahNumber === 1 && text.startsWith(bismillah)) {
    return text.slice(bismillah.length).trim()
  }

  return text
}
