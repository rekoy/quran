"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

interface BannerItem {
  id: number
  title: string
  description: string
  link: string
  bgColor: string
  isExternal?: boolean
  icon?: React.ReactNode
}

export function HeroBanner() {
  const { language } = useLanguage()
  const [currentBanner, setCurrentBanner] = useState(0)

  // Banner content in different languages
  const banners: Record<string, BannerItem[]> = {
    en: [
      {
        id: 1,
        title: "Daily Dhikr",
        description: "Remember Allah with our interactive Dhikr counter",
        link: "https://zikir.now/",
        bgColor: "bg-amber-500",
        isExternal: true,
        icon: <ExternalLink className="h-4 w-4 ml-1" />,
      },
      {
        id: 2,
        title: "Ramadan Guide",
        description: "Prepare for the blessed month with our comprehensive guide",
        link: "/ramadan",
        bgColor: "bg-emerald-600",
        icon: <ArrowRight className="h-4 w-4 ml-1" />,
      },
      {
        id: 3,
        title: "Prayer Times",
        description: "Get accurate prayer times for your location",
        link: "/prayer-times",
        bgColor: "bg-blue-600",
        icon: <ArrowRight className="h-4 w-4 ml-1" />,
      },
    ],
    ar: [
      {
        id: 1,
        title: "أذكار يومية",
        description: "اذكر الله مع عداد الذكر التفاعلي",
        link: "https://zikir.now/",
        bgColor: "bg-amber-500",
        isExternal: true,
        icon: <ExternalLink className="h-4 w-4 mr-1" />,
      },
      {
        id: 2,
        title: "دليل رمضان",
        description: "استعد للشهر المبارك مع دليلنا الشامل",
        link: "/ramadan",
        bgColor: "bg-emerald-600",
        icon: <ArrowRight className="h-4 w-4 mr-1" />,
      },
      {
        id: 3,
        title: "مواقيت الصلاة",
        description: "احصل على مواقيت الصلاة الدقيقة لموقعك",
        link: "/prayer-times",
        bgColor: "bg-blue-600",
        icon: <ArrowRight className="h-4 w-4 mr-1" />,
      },
    ],
    id: [
      {
        id: 1,
        title: "Dzikir Harian",
        description: "Ingat Allah dengan penghitung Dzikir interaktif kami",
        link: "https://zikir.now/",
        bgColor: "bg-amber-500",
        isExternal: true,
        icon: <ExternalLink className="h-4 w-4 ml-1" />,
      },
      {
        id: 2,
        title: "Panduan Ramadhan",
        description: "Persiapkan bulan yang diberkati dengan panduan lengkap kami",
        link: "/ramadan",
        bgColor: "bg-emerald-600",
        icon: <ArrowRight className="h-4 w-4 ml-1" />,
      },
      {
        id: 3,
        title: "Jadwal Sholat",
        description: "Dapatkan waktu sholat yang akurat untuk lokasi Anda",
        link: "/prayer-times",
        bgColor: "bg-blue-600",
        icon: <ArrowRight className="h-4 w-4 ml-1" />,
      },
    ],
    // Add other languages as needed
  }

  // Default to English if the current language isn't available
  const currentBanners = banners[language] || banners.en

  // Shuffle to next banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % currentBanners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentBanners.length])

  const banner = currentBanners[currentBanner]

  return (
    <div className="w-full overflow-hidden mb-4">
      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {currentBanners.map((item) => (
            <div key={item.id} className={`w-full flex-shrink-0 ${item.bgColor} text-white p-4 shadow-md`}>
              {item.isExternal ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg flex items-center">
                      {item.title} {language === "ar" && item.icon}
                    </h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                  <div className="flex items-center">{language !== "ar" && item.icon}</div>
                </a>
              ) : (
                <Link href={item.link} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center">
                      {item.title} {language === "ar" && item.icon}
                    </h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                  <div className="flex items-center">{language !== "ar" && item.icon}</div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Banner navigation dots */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
          {currentBanners.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentBanner ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
              onClick={() => setCurrentBanner(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
