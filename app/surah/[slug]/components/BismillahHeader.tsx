interface BismillahHeaderProps {
  surahNumber: number
}

export default function BismillahHeader({ surahNumber }: BismillahHeaderProps) {
  const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ"

  // Don't show Bismillah for Al-Fatihah (surah 1) or At-Tawbah (surah 9)
  if (surahNumber === 1 || surahNumber === 9) {
    return null
  }

  return (
    <div className="text-center py-6 mb-8 border-b-2 border-primary">
      <p className="text-3xl font-arabic text-right text-primary font-bold leading-relaxed">{bismillah}</p>
      <p className="text-sm text-gray-500 mt-2">In the Name of Allah, the Most Gracious, the Most Merciful</p>
    </div>
  )
}
