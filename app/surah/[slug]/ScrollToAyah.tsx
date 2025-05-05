"use client"

import { useEffect } from "react"

interface ScrollToAyahProps {
  targetAyahId: string | null
}

export default function ScrollToAyah({ targetAyahId }: ScrollToAyahProps) {
  useEffect(() => {
    if (!targetAyahId) return

    // Delay to ensure the DOM is fully loaded
    const timer = setTimeout(() => {
      const element = document.getElementById(targetAyahId)
      if (element) {
        // Scroll to the element with smooth behavior
        element.scrollIntoView({ behavior: "smooth", block: "center" })

        // Add highlight effect
        element.classList.add("bg-yellow-100")

        // Remove highlight after a delay
        setTimeout(() => {
          element.classList.remove("bg-yellow-100")
          element.classList.add("bg-yellow-50")
          setTimeout(() => {
            element.classList.remove("bg-yellow-50")
          }, 2000)
        }, 1500)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [targetAyahId])

  return null // This component doesn't render anything
}
