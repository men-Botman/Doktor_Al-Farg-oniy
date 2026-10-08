import { CalendarDays, Moon, Search, Stethoscope, Sun } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import type { LanguageCode, ThemeMode } from '../types'

type NavbarProps = {
  activeTab: 'doctors' | 'appointments'
  onTabChange: (tab: 'doctors' | 'appointments') => void
  bookingCount: number
  searchTerm: string
  onSearchChange: (value: string) => void
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
  theme: ThemeMode
  onThemeToggle: () => void
}

export function Navbar({
  activeTab,
  onTabChange,
  bookingCount,
  searchTerm,
  onSearchChange,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
}: NavbarProps) {
  const { t } = useLanguage()

  const tabs = [
    { key: 'doctors' as const, label: t('nav.doctors') },
    { key: 'appointments' as const, label: t('nav.appointments') },
  ]

  const isDark = theme === 'dark'

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl ${isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-white/80'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${isDark ? 'from-cyan-400 to-blue-600' : 'from-blue-600 to-indigo-500'} text-white shadow-lg`}>
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AuraHealth</p>
            <p className={`text-[11px] uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Medical Platform
            </p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className={`flex w-full max-w-xl items-center gap-3 rounded-2xl border px-4 py-2.5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}>
            <Search className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className={`w-full border-0 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none ${isDark ? 'text-white' : 'text-slate-700'}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onThemeToggle}
            className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-300 ${isDark ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <div className={`flex items-center gap-1 rounded-full border p-1 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
            {(['uz', 'ru', 'en'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onLanguageChange(option)}
                className={`cursor-pointer select-none rounded-full px-2.5 py-1.5 text-xs font-semibold ${language === option ? (isDark ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white') : isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <nav className={`hidden items-center gap-2 rounded-full border p-1 sm:flex ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`cursor-pointer select-none rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDark
                        ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm md:flex ${isDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
            <CalendarDays className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <span>
              {bookingCount} {t('nav.liveCount')}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
