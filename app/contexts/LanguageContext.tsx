"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Translations = {
  header: {
    title: string
    search: string
    user: string
    settings: string
  }
  quickLinks: {
    about: string
    alMulk: string
    yaseen: string
    alKahf: string
    alWaqiah: string
  }
  growthJourney: {
    title: string
    readingGoals: string
    createGoal: string
    learningPlans: string
    seeAllPlans: string
  }
  surahList: {
    recentlyRead: string
    bookmarks: string
    search: string
    ayahs: string
    previous: string
    next: string
    page: string
  }
}

type LanguageContextType = {
  language: "en" | "ar" | "id" | "ja" | "zh" | "ko"
  setLanguage: (lang: "en" | "ar" | "id" | "ja" | "zh" | "ko") => void
  translations: Translations | null
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage if available
  const [language, setLanguage] = useState<LanguageContextType["language"]>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("quran-language")
      return (savedLanguage as LanguageContextType["language"]) || "en"
    }
    return "en"
  })

  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update localStorage when language changes
  const handleSetLanguage = (lang: LanguageContextType["language"]) => {
    console.log(`Changing language to: ${lang}`)
    if (lang === language) {
      console.log("Language is already set to", lang)
      return // Don't do anything if language is already set
    }

    try {
      // Update state first
      setLanguage(lang)

      // Then update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("quran-language", lang)
        console.log(`Language saved to localStorage: ${lang}`)
      }
    } catch (error) {
      console.error("Error setting language:", error)
    }
  }

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true)
      try {
        console.log(`Fetching translations for language: ${language}`)
        const response = await fetch(`/api/translations?lang=${language}`)
        if (!response.ok) throw new Error(`Failed to fetch translations: ${response.status}`)
        const data = await response.json()
        console.log(`Translations loaded successfully for ${language}`)
        setTranslations(data)
      } catch (error) {
        console.error("Error fetching translations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslations()
  }, [language])

  // Check URL for language parameter on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      const langParam = url.searchParams.get("lang")

      if (langParam && ["en", "ar", "id", "ja", "zh", "ko"].includes(langParam)) {
        console.log(`Setting initial language from URL parameter: ${langParam}`)
        handleSetLanguage(langParam as LanguageContextType["language"])
      }
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, translations, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
