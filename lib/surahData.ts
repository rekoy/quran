import type { Surah } from "@/types/surah"

// This is a mock function. In a real application, you would fetch this data from an API or database.
export async function getSurahBySlug(slug: string): Promise<Surah | null> {
  // Mock data for demonstration purposes
  const mockSurahs: Surah[] = [
    {
      number: 1,
      name: "الفاتحة",
      englishName: "Al-Fatihah",
      englishNameTranslation: "The Opening",
      numberOfAyahs: 7,
      revelationType: "Meccan",
      slug: "al-fatihah",
    },
    // Add more surahs as needed
  ]

  const surah = mockSurahs.find((s) => s.slug === slug)
  return surah || null
}
