import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translate } from '../i18n/translations'
import type { LanguageCode } from '../types'

const STORAGE_KEY = 'aurahealth-language'

type LanguageContextValue = {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string, variables?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') {
      return 'uz'
    }

    const saved = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null
    return saved === 'uz' || saved === 'ru' || saved === 'en' ? saved : 'uz'
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key, variables) => translate(language, key, variables ?? {}),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
