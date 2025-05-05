"use client"

import Link from "next/link"
import { Menu, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSelector from "./LanguageSelector"
import { useLanguage } from "../contexts/LanguageContext"

export function Header() {
  const { translations, language } = useLanguage()

  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-black">
            {translations?.header.title || "Quran.co"}
          </Link>
          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">{language.toUpperCase()}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-black hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-black hover:text-primary">
            About
          </Link>
          <a
            href="https://zikir.now/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-primary flex items-center gap-1"
          >
            Zikir.now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </a>
          {/* Add more navigation items as needed */}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            className="text-black"
            title={translations?.header.user || "User profile"}
          >
            <User className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-black"
            title={translations?.header.settings || "Settings"}
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-primary">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
