"use client"

import { Button } from "@/components/ui/button"
import { Share2, Facebook, Twitter, PhoneIcon as WhatsApp, LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  text: string
  url: string
}

export default function ShareButtons({ text, url }: ShareButtonsProps) {
  const shareText = `${text}\n\nRead more at:`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Ayah",
          text: shareText,
          url: url,
        })
        toast.success("Content shared successfully!")
      } catch (error) {
        console.error("Error sharing:", error)
        // Don't show error toast for user cancellations
        if ((error as Error).name !== "AbortError") {
          // If permission denied or other error, fall back to copy link
          handleCopyLink()
          toast.info("Couldn't use share feature. Link copied to clipboard instead.")
        }
      }
    } else {
      handleCopyLink()
      toast.info("Direct sharing not supported in this browser. Link copied to clipboard instead.")
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy:", error)
      toast.error("Failed to copy link")
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`,
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} title="Share">
        <Share2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => window.open(shareUrls.facebook, "_blank")}
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => window.open(shareUrls.twitter, "_blank")}
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => window.open(shareUrls.whatsapp, "_blank")}
        title="Share on WhatsApp"
      >
        <WhatsApp className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyLink} title="Copy link">
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
