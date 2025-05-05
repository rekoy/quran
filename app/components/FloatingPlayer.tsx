"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

interface FloatingPlayerProps {
  audioSrc: string
  surahName: string
  ayahNumber: number
}

export default function FloatingPlayer({ audioSrc, surahName, ayahNumber }: FloatingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)

    // Start playing when a new audio source is set
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error("Playback failed:", error))

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
    }
  }, []) // Removed unnecessary dependency: audioSrc

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime += seconds
    }
  }

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
      <audio ref={audioRef} src={audioSrc} />
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex-1">
          <h3 className="font-medium">{surahName}</h3>
          <p className="text-sm text-gray-500">Ayah {ayahNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleSkip(-10)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleSkip(10)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 ml-4">
          <Slider value={[currentTime]} max={duration} step={0.1} onValueChange={handleSliderChange} />
        </div>
      </div>
    </div>
  )
}
