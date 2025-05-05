"use client"

import { Button } from "@/components/ui/button"
import { Share2, Facebook, Twitter, PhoneIcon as WhatsApp, LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  text: string
  url: string
  meta: {
    title: string
    description: string
    imageUrl?: string
  }
}

const isWebShareSupported = () => {
  return typeof navigator !== "undefined" && !!navigator.share && typeof navigator.canShare === "function"
}

function ShareButtons({ text, url, meta }: ShareButtonsProps) {
  const shareText = `${text}

Read more at: ${url}`

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const shareData = {
          title: meta.title,
          text: meta.description,
          url: url,
        }

        // Check if the browser can share this data
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          toast.success("Content shared successfully!")
        } else {
          // Fallback if the data can't be shared
          handleCopyLink()
          toast.info("Couldn't use share feature. Link copied to clipboard instead.")
        }
      } catch (error) {
        console.error("Error sharing:", error)
        // Don't show error toast for user cancellations
        if (error instanceof Error && error.name !== "AbortError") {
          // If permission denied or other error, fall back to copy link
          handleCopyLink()
          toast.info("Couldn't use share feature. Link copied to clipboard instead.")
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink()
      toast.info("Direct sharing not supported in this browser. Link copied to clipboard instead.")
    }
  }

  const handleCopyLink = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand("copy")
        toast.success("Link copied to clipboard!")
      } catch (err) {
        toast.error("Failed to copy link")
      } finally {
        document.body.removeChild(textarea)
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy:", error)
      toast.error("Failed to copy link")
    }
  }

  const handleSocialShare = (platform: string) => {
    const width = 600
    const height = 400
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.description)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(meta.description + " " + url)}`,
    }

    try {
      window.open(
        shareUrls[platform as keyof typeof shareUrls],
        "share",
        `width=${width},height=${height},left=${left},top=${top}`,
      )
    } catch (error) {
      console.error(`Failed to open ${platform} share window:`, error)
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank")
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isWebShareSupported() && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} title="Share">
          <Share2 className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleSocialShare("facebook")}
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleSocialShare("twitter")}
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleSocialShare("whatsapp")}
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

export { ShareButtons }

export default ShareButtons
