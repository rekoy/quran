import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const surahNumber = searchParams.get("surah")
  const ayahNumber = searchParams.get("ayah") || "1"

  if (!surahNumber) {
    return new Response("Missing surah number", { status: 400 })
  }

  try {
    const surahRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
    const surahData = await surahRes.json()
    const surah = surahData.data

    const ayahRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`)
    const ayahData = await ayahRes.json()
    const ayah = ayahData.data

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00AD5F",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 60, margin: 0 }}>{surah.englishName}</h1>
        <h2 style={{ fontSize: 48, margin: "20px 0" }}>{surah.name}</h2>
        <p style={{ fontSize: 36, margin: 0 }}>
          Surah {surahNumber}, Ayah {ayahNumber}
        </p>
        <p style={{ fontSize: 24, margin: "20px 0", maxWidth: "80%", textAlign: "center" }}>{ayah.text}</p>
        <p style={{ fontSize: 18, position: "absolute", bottom: 20, right: 20 }}>Quran.co</p>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
