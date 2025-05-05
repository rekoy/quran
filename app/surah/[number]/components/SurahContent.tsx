import Link from "next/link"
import { Toaster } from "sonner"
import { AudioPlayer } from "./AudioPlayer"
import { ShareButtons } from "@/components/ShareButtons"
import { FloatingPlayer } from "@/components/FloatingPlayer"
import { StructuredData } from "@/components/StructuredData"
import type { Surah, Ayah } from "@/types"

interface SurahContentProps {
  surahData: {
    surah: Surah
    arabicAyahs: Ayah[]
    englishAyahs: Ayah[]
  }
}

export function SurahContent({ surahData }: SurahContentProps) {
  const { surah, arabicAyahs, englishAyahs } = surahData

  return (
    <>
      <StructuredData surah={surah} url={`https://quran.co/surah/${surah.number}`} />
      <div className="min-h-screen bg-[#00AD5F] py-8 pb-24">
        <Toaster position="top-center" />
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-8">
          <Link href="/" className="text-[#00AD5F] hover:underline mb-4 inline-block">
            &larr; Back to Surah List
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {surah.englishName} - {surah.name}
          </h1>
          <h2 className="text-xl text-gray-600 mb-4">{surah.englishNameTranslation}</h2>
          <div className="mb-6">
            <p>
              <strong>Number of Ayahs:</strong> {surah.numberOfAyahs}
            </p>
            <p>
              <strong>Revelation Type:</strong> {surah.revelationType}
            </p>
          </div>
          <div className="space-y-6">
            {arabicAyahs.map((ayah, index) => (
              <div key={ayah.number} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#00AD5F]">{ayah.numberInSurah}</span>
                  <div className="flex items-center gap-4">
                    <ShareButtons
                      text={`${ayah.text}\n\n${englishAyahs[index]?.text || ""}`}
                      url={`https://quran.co/surah/${surah.number}#ayah-${ayah.numberInSurah}`}
                      meta={{
                        title: `${surah.englishName} (${surah.name}) - Ayah ${ayah.numberInSurah}`,
                        description: `${ayah.text.slice(0, 100)}... - Read more on Quran.co`,
                        imageUrl: `https://quran.co/api/og-image?surah=${surah.number}&ayah=${ayah.numberInSurah}`,
                      }}
                    />
                    <AudioPlayer audioSrc={ayah.audio} onPlay={() => {}} />
                  </div>
                </div>
                <p id={`ayah-${ayah.numberInSurah}`} className="text-2xl mb-2 text-right font-arabic">
                  {ayah.text}
                </p>
                <p className="text-lg mb-2">{englishAyahs[index]?.text || "Translation not available"}</p>
                <p className="text-sm text-gray-500">Juz: {ayah.juz}</p>
              </div>
            ))}
          </div>
        </div>
        <FloatingPlayer
          audioSrc=""
          surahName={surah.englishName}
          ayahNumber={1}
          totalAyahs={surah.numberOfAyahs}
          onNextAyah={() => {}}
          onNextSurah={() => {}}
        />
      </div>
    </>
  )
}
