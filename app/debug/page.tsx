"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  surah: {
    number: number
    name: string
    englishName: string
    englishNameTranslation: string
    numberOfAyahs: number
    revelationType: string
  }
}

const removeBismillah = (
  text: string,
  surahNumber: number,
  ayahNumber: number,
): { processedText: string; bismillahRemoved: boolean } => {
  const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ"
  // Hanya pertahankan Bismillah untuk Al-Fatihah (surah nomor 1)
  if (surahNumber === 1) {
    return { processedText: text, bismillahRemoved: false }
  }

  // Hapus Bismillah dari awal ayat untuk semua surah lainnya
  if (ayahNumber === 1 && text.startsWith(bismillah)) {
    return { processedText: text.slice(bismillah.length).trim(), bismillahRemoved: true }
  }

  return { processedText: text, bismillahRemoved: false }
}

export default function DebugPage() {
  const [surahNumber, setSurahNumber] = useState("")
  const [ayahNumber, setAyahNumber] = useState("")
  const [ayahData, setAyahData] = useState<Ayah | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAyah = async () => {
    setIsLoading(true)
    setError(null)
    setAyahData(null)

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`)
      if (!response.ok) {
        throw new Error("Failed to fetch ayah data")
      }
      const data = await response.json()
      setAyahData(data.data)
    } catch (err) {
      setError("An error occurred while fetching the ayah. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAyah()
  }

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="max-w-4xl mx-auto bg-secondary rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Debug Ayah Display</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="surahNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Surah Number
            </label>
            <Input
              id="surahNumber"
              type="number"
              min="1"
              max="114"
              value={surahNumber}
              onChange={(e) => setSurahNumber(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="ayahNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Ayah Number
            </label>
            <Input
              id="ayahNumber"
              type="number"
              min="1"
              value={ayahNumber}
              onChange={(e) => setAyahNumber(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Fetch Ayah"}
          </Button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {ayahData && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Surah {ayahData.surah.englishName} ({ayahData.surah.name}) - Ayah {ayahData.numberInSurah}
            </h2>
            <p className="text-xl font-arabic text-right">
              {(() => {
                const bismillah = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ"
                const { processedText, bismillahRemoved } = removeBismillah(
                  ayahData.text,
                  ayahData.surah.number,
                  ayahData.numberInSurah,
                )

                return (
                  <>
                    <span className="block text-sm text-gray-600 mb-2">
                      {bismillahRemoved ? (
                        <>
                          Bismillah dihapus (panjang: {bismillah.length} karakter)
                          <br />
                          Panjang teks yang diproses: {processedText.length} karakter
                        </>
                      ) : ayahData.surah.number === 1 ? (
                        <>
                          Bismillah dipertahankan untuk Al-Fatihah
                          <br />
                          Panjang teks total: {processedText.length} karakter
                        </>
                      ) : (
                        <>
                          Bismillah tidak ada
                          <br />
                          Panjang teks total: {processedText.length} karakter
                        </>
                      )}
                    </span>
                    {processedText}
                  </>
                )
              })()}
            </p>
            <p className="text-lg font-arabic text-right text-gray-500 mt-2">Original text: {ayahData.text}</p>
            <div className="space-y-2">
              <p>
                <strong>Surah Number:</strong> {ayahData.surah.number}
              </p>
              <p>
                <strong>Ayah Number in Surah:</strong> {ayahData.numberInSurah}
              </p>
              <p>
                <strong>Ayah Number Overall:</strong> {ayahData.number}
              </p>
              <p>
                <strong>Juz:</strong> {ayahData.juz}
              </p>
              <p>
                <strong>Surah English Name:</strong> {ayahData.surah.englishName}
              </p>
              <p>
                <strong>Surah English Translation:</strong> {ayahData.surah.englishNameTranslation}
              </p>
              <p>
                <strong>Number of Ayahs in Surah:</strong> {ayahData.surah.numberOfAyahs}
              </p>
              <p>
                <strong>Revelation Type:</strong> {ayahData.surah.revelationType}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
