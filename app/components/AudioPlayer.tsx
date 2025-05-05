"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface AudioPlayerProps {
  audioSrc: string
  onPlay: () => void
  onEnded: () => void
  disabled: boolean
}

export default function AudioPlayer({ audioSrc, onPlay, onEnded, disabled }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        onPlay()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        onEnded()
      })
      return () => {
        audio.removeEventListener("ended", onEnded)
      }
    }
  }, [onEnded])

  useEffect(() => {
    if (disabled && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  }, [disabled, isPlaying]) // Added isPlaying to dependencies

  return (
    <>
      <audio ref={audioRef} src={audioSrc} />
      <Button
        variant="outline"
        size="icon"
        onClick={togglePlayPause}
        disabled={disabled}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={`w-10 h-10 rounded-full bg-[#00AD5F] text-white hover:bg-[#00AD5F]/80 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
    </>
  )
}
