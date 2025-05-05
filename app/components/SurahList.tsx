"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  juzNumber?: number
}

interface JuzMapping {
  [surahNumber: number]: number[]
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function getSurahs(): Promise<Surah[]> {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah")
    if (!res.ok) {
      throw new Error(`Failed to fetch surahs: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    if (!Array.isArray(data.data)) {
      throw new Error("Invalid data structure received from API")
    }
    return data.data
  } catch (error) {
    console.error("Error fetching surahs:", error)
    return []
  }
}

// This is a static mapping of which surahs belong to which juz
// This avoids making 30 API calls and potential rate limiting
const juzSurahMapping: JuzMapping = {
  1: [1, 2], // Juz 1: Al-Fatihah to Al-Baqarah (part)
  2: [2], // Juz 2: Al-Baqarah (part)
  3: [2, 3], // Juz 3: Al-Baqarah (end) to Ali 'Imran (part)
  4: [3, 4], // Juz 4: Ali 'Imran (part) to An-Nisa' (part)
  5: [4], // Juz 5: An-Nisa' (part)
  6: [4, 5], // Juz 6: An-Nisa' (end) to Al-Ma'idah (part)
  7: [5, 6], // Juz 7: Al-Ma'idah (end) to Al-An'am (part)
  8: [6, 7], // Juz 8: Al-An'am (end) to Al-A'raf (part)
  9: [7, 8], // Juz 9: Al-A'raf (end) to Al-Anfal (part)
  10: [8, 9], // Juz 10: Al-Anfal (end) to At-Tawbah (part)
  11: [9, 10, 11], // Juz 11: At-Tawbah (end) to Hud (part)
  12: [11, 12], // Juz 12: Hud (part) to Yusuf (part)
  13: [12, 13, 14], // Juz 13: Yusuf (end) to Ibrahim (part)
  14: [15, 16], // Juz 14: Al-Hijr to An-Nahl (part)
  15: [17, 18], // Juz 15: Al-Isra' to Al-Kahf (part)
  16: [18, 19, 20], // Juz 16: Al-Kahf (end) to Ta-Ha (part)
  17: [21, 22], // Juz 17: Al-Anbya' to Al-Hajj (part)
  18: [23, 24, 25], // Juz 18: Al-Mu'minun to Al-Furqan (part)
  19: [25, 26, 27], // Juz 19: Al-Furqan (end) to An-Naml (part)
  20: [27, 28, 29], // Juz 20: An-Naml (end) to Al-'Ankabut (part)
  21: [29, 30, 31, 32, 33], // Juz 21: Al-'Ankabut (end) to Al-Ahzab (part)
  22: [33, 34, 35, 36], // Juz 22: Al-Ahzab (end) to Ya-Sin (part)
  23: [36, 37, 38, 39], // Juz 23: Ya-Sin (end) to Az-Zumar (part)
  24: [39, 40, 41], // Juz 24: Az-Zumar (end) to Fussilat (part)
  25: [41, 42, 43, 44, 45], // Juz 25: Fussilat (end) to Al-Jathiyah (part)
  26: [46, 47, 48, 49, 50, 51], // Juz 26: Al-Ahqaf to Adh-Dhariyat (part)
  27: [51, 52, 53, 54, 55, 56, 57], // Juz 27: Adh-Dhariyat (end) to Al-Hadid (part)
  28: [58, 59, 60, 61, 62, 63, 64, 65, 66], // Juz 28: Al-Mujadila to At-Tahrim (part)
  29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], // Juz 29: Al-Mulk to Al-Mursalat (part)
  30: [
    78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104,
    105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
  ], // Juz 30: An-Naba' to An-Nas
}

// Function to organize surahs by juz using the static mapping
function organizeSurahsByJuz(surahs: Surah[]) {
  const juzData: { [juzNumber: number]: Surah[] } = {}

  // Initialize juz data structure
  for (let i = 1; i <= 30; i++) {
    juzData[i] = []
  }

  // Organize surahs into their respective juz
  surahs.forEach((surah) => {
    for (const [juzNumber, surahNumbers] of Object.entries(juzSurahMapping)) {
      if (surahNumbers.includes(surah.number)) {
        juzData[Number(juzNumber)].push({ ...surah, juzNumber: Number(juzNumber) })
      }
    }
  })

  return juzData
}

export function SurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { translations } = useLanguage()
  const rowsPerPage = 10
  const [viewMode, setViewMode] = useState<"list" | "juz">("list")
  const [juzData, setJuzData] = useState<{ [juzNumber: number]: Surah[] }>({})
  const [isLoadingJuz, setIsLoadingJuz] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    getSurahs()
      .then((data) => {
        if (data.length > 0) {
          setSurahs(data)
        } else {
          setError("No surahs found. Please try again later.")
        }
      })
      .catch((error) => {
        console.error("Failed to fetch surahs:", error)
        setError("An error occurred while fetching surahs. Please try again later.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredSurahs.length / rowsPerPage)
  const paginatedSurahs = filteredSurahs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleJuzView = () => {
    if (viewMode === "juz") {
      setViewMode("list")
      return
    }

    setViewMode("juz")

    if (Object.keys(juzData).length === 0) {
      setIsLoadingJuz(true)
      try {
        const organizedData = organizeSurahsByJuz(surahs)
        setJuzData(organizedData)
      } catch (error) {
        console.error("Failed to organize juz data:", error)
        setError("An error occurred while organizing juz data. Please try again later.")
      } finally {
        setIsLoadingJuz(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-secondary rounded-lg p-8 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-secondary rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-primary text-white">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-secondary rounded-lg p-8">
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder={translations?.surahList.search || "Search surah..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white text-primary-foreground"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
        <Button variant="ghost" className="text-black hover:bg-primary hover:text-white">
          {translations?.surahList.recentlyRead || "Recently Read"}
        </Button>
        <Button variant="ghost" className="text-black hover:bg-primary hover:text-white">
          {translations?.surahList.bookmarks || "Bookmarks"}
        </Button>
        <Button
          variant="ghost"
          className={`text-black hover:bg-primary hover:text-white ${viewMode === "juz" ? "bg-primary text-white" : ""}`}
          onClick={handleJuzView}
        >
          Group by Juz
        </Button>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {paginatedSurahs.map((surah) => (
            <Link
              href={`/surah/${createSlug(surah.englishName)}`}
              key={surah.number}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full text-lg font-bold">
                  {surah.number}
                </span>
                <div>
                  <h3 className="font-medium text-lg text-black leading-6">{surah.englishName}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-black">
                  {surah.numberOfAyahs} {translations?.surahList.ayahs || "Ayahs"}
                </span>
                <p className="text-black text-xl font-arabic">{surah.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : isLoadingJuz ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(juzData).map(([juzNumber, juzSurahs]) => (
            <div key={juzNumber} className="border rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Juz {juzNumber}</h3>
              <div className="space-y-2">
                {juzSurahs.map((surah) => (
                  <Link
                    href={`/surah/${createSlug(surah.englishName)}`}
                    key={`${juzNumber}-${surah.number}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full text-sm font-bold">
                        {surah.number}
                      </span>
                      <div>
                        <h4 className="font-medium text-black">{surah.englishName}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-black">
                        {surah.numberOfAyahs} {translations?.surahList.ayahs || "Ayahs"}
                      </span>
                      <p className="text-black text-lg font-arabic">{surah.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-black hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> {translations?.surahList.previous || "Previous"}
          </Button>
          <span className="text-black">
            {translations?.surahList.page
              ? translations.surahList.page
                  .replace("{current}", currentPage.toString())
                  .replace("{total}", totalPages.toString())
              : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-black hover:bg-primary hover:text-white"
          >
            {translations?.surahList.next || "Next"} <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
