"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    console.log(`Language selected: ${langCode}`)
    setLanguage(langCode as "en" | "ar" | "id" | "ja" | "zh" | "ko")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="w-[130px] justify-between text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLanguage.name}
        <ChevronDown className="h-4 w-4 opacity-50 text-black" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[130px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`w-full text-left px-4 py-2 text-sm ${
                  language === lang.code ? "bg-accent text-accent-foreground" : "text-gray-700 hover:bg-gray-100"
                }`}
                role="menuitem"
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
