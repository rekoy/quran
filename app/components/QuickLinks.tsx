"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../contexts/LanguageContext"

export function QuickLinks() {
  const { translations } = useLanguage()

  const quickLinks = [
    { name: translations?.quickLinks.about || "About Quran.co", href: "/about" },
    { name: translations?.quickLinks.alMulk || "Al Mulk", href: "/surah/67" },
    { name: translations?.quickLinks.yaseen || "Yaseen", href: "/surah/36" },
    { name: translations?.quickLinks.alKahf || "Al Kahf", href: "/surah/18" },
    { name: translations?.quickLinks.alWaqiah || "Al Waqi'ah", href: "/surah/56" },
    { name: "About Us", href: "/about" },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {quickLinks.map((link) => (
        <Link key={link.name} href={link.href}>
          <Button variant="ghost" className="text-black hover:bg-secondary/20">
            {link.name}
          </Button>
        </Link>
      ))}
    </div>
  )
}
