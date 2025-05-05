"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface VideoPlayerProps {
  videoSrc: string
  onPlay: () => void
  onPause: () => void
}

export default function VideoPlayer({ videoSrc, onPlay, onPause }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        onPlay()
      } else {
        videoRef.current.pause()
        onPause()
      }
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("play", onPlay)
      video.addEventListener("pause", onPause)
      return () => {
        video.removeEventListener("play", onPlay)
        video.removeEventListener("pause", onPause)
      }
    }
  }, [onPlay, onPause])

  return (
    <div className="relative">
      <video ref={videoRef} src={videoSrc} className="w-full rounded-lg" />
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlayPause}
        className="absolute bottom-4 left-4 bg-white/80 hover:bg-white"
      >
        {videoRef.current?.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </Button>
    </div>
  )
}
