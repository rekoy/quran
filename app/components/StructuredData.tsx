import type { Surah } from "../types"

interface StructuredDataProps {
  surah: Surah
  url: string
}

export function StructuredData({ surah, url }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: `${surah.englishName} (${surah.name}) - Surah ${surah.number}`,
    description: `Read and listen to Surah ${surah.englishName} (${surah.name}), the ${surah.number}th chapter of the Quran with ${surah.numberOfAyahs} verses.`,
    image: `https://quran.co/api/og-image?surah=${surah.number}`,
    author: {
      "@type": "Organization",
      name: "Quran.co",
    },
    publisher: {
      "@type": "Organization",
      name: "Quran.co",
      logo: {
        "@type": "ImageObject",
        url: "https://quran.co/logo.png",
      },
    },
    datePublished: "2023-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
