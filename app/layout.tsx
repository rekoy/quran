import type React from "react"
import type { Metadata } from "next"
import { Inter, Amiri } from "next/font/google"
import "./globals.css"
import "./styles/ayah-highlight.css"
import { LanguageProvider } from "./contexts/LanguageContext"
import { Header } from "./components/Header"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" })

export const metadata: Metadata = {
  metadataBase: new URL("https://quran.co"),
  title: {
    default: "Quran.co - Read and Listen to the Quran",
    template: "%s | Quran.co",
  },
  description:
    "Read, listen, and learn the Holy Quran online with translations and audio recitations. Discover the wisdom of Islamic teachings.",
  // ... (rest of the metadata)
  generator: "v0.dev",
}

// Simple debug component to show language state
function LanguageDebug() {
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.write('Language: ' + (localStorage.getItem('quran-language') || 'not set'));
        `,
        }}
      />
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=G-XWVW5NNCR6`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XWVW5NNCR6');
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${amiri.variable}`}>
        <LanguageProvider>
          <Header />
          {children}
          {process.env.NODE_ENV !== "production" && <LanguageDebug />}
        </LanguageProvider>
      </body>
    </html>
  )
}
