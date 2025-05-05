"use client"

import { useLanguage } from "../contexts/LanguageContext"

export function LanguageDebug() {
  const { language, translations, isLoading } = useLanguage()

  return (
    <div>
      <p>Current Language: {language}</p>
      <p>Loading: {isLoading ? "Yes" : "No"}</p>
      <p>Translations Available: {translations ? "Yes" : "No"}</p>
      {translations && (
        <details>
          <summary>Sample Translations</summary>
          <p>Title: {translations.header.title}</p>
          <p>Search: {translations.header.search}</p>
        </details>
      )}
    </div>
  )
}
