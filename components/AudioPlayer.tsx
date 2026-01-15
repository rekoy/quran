"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useRef, useEffect } from "react"

interface AudioPlayerProps {
  audioSrc: string
  onPlay: () => void
  onEnded: () => void
}

export default function AudioPlayer({ audioSrc, onPlay, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlay = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            onPlay()
          })
          .catch((error) => {
            console.error("Audio playback failed:", error)
          })
      }
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener("ended", onEnded)
      return () => {
        audio.removeEventListener("ended", onEnded)
      }
    }
  }, [onEnded])

  return (
    <>
      <audio ref={audioRef} src={audioSrc} crossOrigin="anonymous" />
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlay}
        aria-label="Play"
        className="w-10 h-10 rounded-full bg-[#00AD5F] text-white hover:bg-[#00AD5F]/80 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Play className="h-5 w-5" />
      </Button>
    </>
  )
}
