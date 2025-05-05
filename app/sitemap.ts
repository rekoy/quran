import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://quran.co"

  // Fetch the list of all surahs
  const res = await fetch("https://api.alquran.cloud/v1/surah")
  const data = await res.json()
  const surahs = data.data

  const surahUrls = surahs.map((surah: any) => ({
    url: `${baseUrl}/surah/${surah.number}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...surahUrls,
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
