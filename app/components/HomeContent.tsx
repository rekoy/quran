"use client"

import { SurahList } from "./SurahList"
import { QuickLinks } from "./QuickLinks"
import { GrowthJourney } from "./GrowthJourney"

export function HomeContent() {
  return (
    <div className="min-h-screen bg-[#00AD5F]">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <QuickLinks />
        <GrowthJourney />
        <SurahList />
      </main>
    </div>
  )
}
