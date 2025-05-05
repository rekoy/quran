"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import AudioPlayer from "@/app/components/AudioPlayer"
import FloatingPlayer from "@/components/FloatingPlayer"
import ShareButtons from "@/components/ShareButtons"
import { Toaster } from "sonner"
import { Loader2 } from "lucide-react"
import VideoPlayer from "@/app/components/VideoPlayer"
import { ErrorBoundary } from "react-error-boundary"
import { removeBismillah } from "@/lib/quranUtils"

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  slug: string
}

interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  audio: string
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

const timeoutDuration = 10000 // 10 seconds

const fetchWithTimeout = (url: string, options = {}) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeoutDuration)),
  ])
}

const retryFetch = async (url: string, options = {}, retries = 3) => {
  try {
    return await fetchWithTimeout(url, options)
  } catch (err) {
    if (retries > 0) {
      return retryFetch(url, options, retries - 1)
    }
    throw err
  }
}

async function getSurahDetails(
  slug: string,
): Promise<{ surah: Surah; arabicAyahs: Ayah[]; englishAyahs: Ayah[]; transliterationAyahs: Ayah[] } | null> {
  try {
    console.log(`Fetching details for surah with slug: ${slug}`)
    const allSurahsRes = await retryFetch("https://api.alquran.cloud/v1/surah")
    if (!allSurahsRes.ok) {
      throw new Error(`Failed to fetch all surahs: ${allSurahsRes.status} ${allSurahsRes.statusText}`)
    }
    const allSurahsData = await allSurahsRes.json()
    console.log(`Received data for all surahs. Total surahs: ${allSurahsData.data.length}`)

    let surahData
    if (isNaN(Number(slug))) {
      // If slug is not a number, search by English name
      surahData = allSurahsData.data.find((s: any) => createSlug(s.englishName) === slug)
    } else {
      // If slug is a number, search by surah number
      surahData = allSurahsData.data.find((s: any) => s.number === Number(slug))
    }

    if (!surahData) {
      throw new Error(`Surah not found for slug: ${slug}`)
    }
    console.log(`Found surah data for slug: ${slug}. Surah number: ${surahData.number}`)

    const [arabicRes, englishRes, audioRes, transliterationRes] = await Promise.all([
      retryFetch(`https://api.alquran.cloud/v1/surah/${surahData.number}`),
      retryFetch(`https://api.alquran.cloud/v1/surah/${surahData.number}/en.asad`),
      retryFetch(`https://api.alquran.cloud/v1/surah/${surahData.number}/ar.alafasy`),
      retryFetch(`https://api.alquran.cloud/v1/surah/${surahData.number}/en.transliteration`).catch((error) => {
        console.error("Failed to fetch transliteration:", error)
        return { ok: false, status: 500 }
      }),
    ])

    if (!arabicRes.ok || !englishRes.ok || !audioRes.ok) {
      throw new Error(
        `Failed to fetch surah details: Arabic (${arabicRes.status}), English (${englishRes.status}), Audio (${audioRes.status})`,
      )
    }

    const [arabicData, englishData, audioData] = await Promise.all([
      arabicRes.json(),
      englishRes.json(),
      audioRes.json(),
    ])

    let transliterationData = { data: { ayahs: [] } }
    if (transliterationRes.ok) {
      transliterationData = await transliterationRes.json()
    } else {
      console.warn("Transliteration data not available. Using empty array as fallback.")
    }

    if (!arabicData.data || !englishData.data || !audioData.data) {
      throw new Error(
        `Invalid data structure received from API: Arabic (${!!arabicData.data}), English (${!!englishData.data}), Audio (${!!audioData.data})`,
      )
    }

    const surah: Surah = {
      ...arabicData.data,
      slug: createSlug(arabicData.data.englishName),
    }

    const arabicAyahsWithAudio = arabicData.data.ayahs.map((ayah: Ayah, index: number) => ({
      ...ayah,
      audio: audioData.data.ayahs[index].audio,
    }))

    return {
      surah,
      arabicAyahs: arabicAyahsWithAudio,
      englishAyahs: englishData.data.ayahs,
      transliterationAyahs: transliterationData.data.ayahs,
    }
  } catch (error) {
    console.error("Error in getSurahDetails:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    throw error
  }
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="min-h-screen bg-[#00AD5F] flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="mb-4">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  )
}

export default function SurahPage({ params }: { params: { slug: string } }) {
  const [surahData, setSurahData] = useState<Awaited<ReturnType<typeof getSurahDetails>> | null>(null)
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null)
  const [currentlyPlayingAyah, setCurrentlyPlayingAyah] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [indonesianAyahs, setIndonesianAyahs] = useState<Ayah[]>([])
  const [japaneseAyahs, setJapaneseAyahs] = useState<Ayah[]>([])
  const [chineseAyahs, setChineseAyahs] = useState<Ayah[]>([])
  const [koreanAyahs, setKoreanAyahs] = useState<Ayah[]>([])
  const [transliterationAyahs, setTransliterationAyahs] = useState<Ayah[]>([])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({})

  // Parse the ayah parameter and language from the URL
  useEffect(() => {
    // Check for ayah parameter
    const ayahParam = searchParams.get("ayah")
    if (ayahParam) {
      const ayahNumber = Number.parseInt(ayahParam, 10)
      if (!isNaN(ayahNumber)) {
        setHighlightedAyah(ayahNumber)
      }
    }

    // Check for language parameter
    const langParam = searchParams.get("lang")
    if (langParam && ["en", "ar", "id", "ja", "zh", "ko"].includes(langParam)) {
      console.log(`Setting language from URL parameter: ${langParam}`)
      setLanguage(langParam as "en" | "ar" | "id" | "ja" | "zh" | "ko")
    }
  }, [searchParams, setLanguage])

  useEffect(() => {
    setIsLoading(true)
    getSurahDetails(params.slug)
      .then((data) => {
        if (data) {
          setSurahData(data)
          setTransliterationAyahs(data.transliterationAyahs)
          console.log(`Successfully set surah data for slug: ${params.slug}`)
          return Promise.all([
            retryFetch(`https://api.alquran.cloud/v1/surah/${data.surah.number}/id.indonesian`).then((res) =>
              res.json(),
            ),
            retryFetch(`https://api.alquran.cloud/v1/surah/${data.surah.number}/ja.japanese`).then((res) => res.json()),
            retryFetch(`https://api.alquran.cloud/v1/surah/${data.surah.number}/zh.chinese`).then((res) => res.json()),
            retryFetch(`https://api.alquran.cloud/v1/surah/${data.surah.number}/ko.korean`).then((res) => res.json()),
          ])
        }
        throw new Error("Failed to load Surah data")
      })
      .then(([indonesianData, japaneseData, chineseData, koreanData]) => {
        setIndonesianAyahs(indonesianData.data.ayahs)
        setJapaneseAyahs(japaneseData.data.ayahs)
        setChineseAyahs(chineseData.data.ayahs)
        setKoreanAyahs(koreanData.data.ayahs)
        console.log("Successfully set translations data")
      })
      .catch((error) => {
        console.error("Error in useEffect:", error)
        if (error instanceof Error) {
          console.error("Error message:", error.message)
          console.error("Error stack:", error.stack)
        }
        setError(`Failed to load Surah. ${error instanceof Error ? error.message : "Unknown error occurred."}`)
      })
      .finally(() => {
        setIsLoading(false)
        console.log("Finished loading surah data")
      })
  }, [params.slug])

  // Scroll to highlighted ayah when data is loaded
  useEffect(() => {
    if (highlightedAyah && surahData && !isLoading) {
      setTimeout(() => {
        const ayahElement = ayahRefs.current[highlightedAyah]
        if (ayahElement) {
          ayahElement.scrollIntoView({ behavior: "smooth", block: "center" })
          ayahElement.classList.add("bg-yellow-100")
          setTimeout(() => {
            ayahElement.classList.remove("bg-yellow-100")
            ayahElement.classList.add("bg-yellow-50")
            setTimeout(() => {
              ayahElement.classList.remove("bg-yellow-50")
            }, 2000)
          }, 1500)
        }
      }, 500)
    }
  }, [highlightedAyah, surahData, isLoading])

  const handleNextSurah = useCallback(() => {
    if (surahData) {
      const nextSurahNumber = (surahData.surah.number % 114) + 1
      router.push(`/surah/${nextSurahNumber}`)
    }
  }, [surahData, router])

  const handleNextAyah = useCallback(() => {
    if (surahData && currentAyah) {
      const nextAyahIndex = surahData.arabicAyahs.findIndex((ayah) => ayah.number === currentAyah.number) + 1
      if (nextAyahIndex < surahData.arabicAyahs.length) {
        setCurrentAyah(surahData.arabicAyahs[nextAyahIndex])
      } else {
        handleNextSurah()
      }
    }
  }, [surahData, currentAyah, handleNextSurah])

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
    if (currentAyah) {
      const audio = document.querySelector("audio") as HTMLAudioElement
      if (audio) {
        audio.pause()
      }
    }
  }

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }

  // Generate a shareable URL for a specific ayah that includes the current language
  const getAyahShareUrl = (ayahNumber: number) => {
    if (typeof window === "undefined") return ""
    const baseUrl = window.location.origin
    return `${baseUrl}/surah/${params.slug}?ayah=${ayahNumber}&lang=${language}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#00AD5F] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-[#00AD5F] animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#00AD5F] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!surahData) {
    return (
      <div className="min-h-screen bg-[#00AD5F] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <p className="text-red-600">Failed to load Surah. Please try again later.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { surah, arabicAyahs, englishAyahs } = surahData

  const handleAyahPlay = (ayah: Ayah) => {
    if (currentlyPlayingAyah === ayah.numberInSurah) {
      setCurrentlyPlayingAyah(null)
      setIsAudioPlaying(false)
    } else {
      setCurrentAyah(ayah)
      setCurrentlyPlayingAyah(ayah.numberInSurah)
      setIsAudioPlaying(true)
    }
  }

  const handleAudioEnded = () => {
    setIsAudioPlaying(false)
    setCurrentlyPlayingAyah(null)
    if (currentAyah && surahData) {
      const nextAyahIndex = currentAyah.numberInSurah - 1
      if (nextAyahIndex + 1 < surahData.surah.numberOfAyahs) {
        const nextAyah = surahData.arabicAyahs[nextAyahIndex + 1]
        setCurrentAyah(nextAyah)
        setCurrentlyPlayingAyah(nextAyah.numberInSurah)
        setIsAudioPlaying(true)
      } else {
        handleNextSurah()
      }
    }
  }

  // Get the appropriate translation based on the current language
  const getTranslation = (index: number) => {
    switch (language) {
      case "ar":
        return removeBismillah(arabicAyahs[index].text, surah.number, arabicAyahs[index].numberInSurah)
      case "en":
        return englishAyahs[index]?.text || "Translation not available"
      case "id":
        return indonesianAyahs[index]?.text || "Terjemahan tidak tersedia"
      case "ja":
        return japaneseAyahs[index]?.text || "翻訳がありません"
      case "zh":
        return chineseAyahs[index]?.text || "翻译不可用"
      case "ko":
        return koreanAyahs[index]?.text || "번역을 사용할 수 없습니다"
      default:
        return englishAyahs[index]?.text || "Translation not available"
    }
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setIsLoading(true)
        setError(null)
        setSurahData(null)
      }}
    >
      <div className="min-h-screen bg-primary py-8 pb-24">
        <Toaster position="top-center" />
        <div className="max-w-4xl mx-auto bg-secondary rounded-lg p-8">
          <Link href="/" className="text-primary-foreground hover:underline mb-4 inline-block">
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
              <div
                key={ayah.number}
                ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)}
                id={`ayah-${ayah.numberInSurah}`}
                className={`border-b pb-4 transition-colors duration-500 ${
                  currentlyPlayingAyah === ayah.numberInSurah ? "bg-green-100 rounded-lg p-4" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary-foreground">{ayah.numberInSurah}</span>
                  <div className="flex items-center gap-4">
                    <ShareButtons
                      text={`${removeBismillah(ayah.text, surah.number, ayah.numberInSurah)}

${getTranslation(index)}`}
                      url={getAyahShareUrl(ayah.numberInSurah)}
                      meta={{
                        title: `${surah.englishName} (${surah.name}) - Ayah ${ayah.numberInSurah}`,
                        description: `${removeBismillah(ayah.text, surah.number, ayah.numberInSurah).slice(
                          0,
                          100,
                        )}... - Read more on Quran.co`,
                        imageUrl: `https://quran.co/api/og-image?surah=${surah.number}&ayah=${ayah.numberInSurah}`,
                      }}
                    />
                    <AudioPlayer
                      audioSrc={ayah.audio}
                      onPlay={() => handleAyahPlay(ayah)}
                      onEnded={handleAudioEnded}
                      disabled={isAudioPlaying && currentlyPlayingAyah !== ayah.numberInSurah}
                    />
                  </div>
                </div>
                <p
                  className="text-2xl my-4 py-2 text-right font-arabic"
                  dangerouslySetInnerHTML={{
                    __html: removeBismillah(ayah.text, surah.number, ayah.numberInSurah),
                  }}
                />
                <p className="text-lg mb-2 text-left text-gray-600 italic">
                  {transliterationAyahs[index]?.text || "Transliteration not available"}
                </p>
                <p className="text-lg mb-2">{getTranslation(index)}</p>
                <p className="text-sm text-gray-500">Juz: {ayah.juz}</p>
              </div>
            ))}
          </div>
        </div>
        <VideoPlayer videoSrc="/path/to/your/video.mp4" onPlay={handleVideoPlay} onPause={handleVideoPause} />
        {currentAyah && (
          <FloatingPlayer
            audioSrc={currentAyah.audio}
            surahName={surah.englishName}
            ayahNumber={currentAyah.numberInSurah}
            totalAyahs={surah.numberOfAyahs}
            onNextAyah={handleNextAyah}
            onNextSurah={handleNextSurah}
            isVideoPlaying={isVideoPlaying}
            onAudioEnded={handleAudioEnded}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
