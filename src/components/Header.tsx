import { motion } from 'framer-motion'
import { Bell, MapPin, ShieldPlus, Stethoscope, Video } from 'lucide-react'
import type { Language } from '../types'

type HeaderProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  bookingCount: number
  activeTab: 'Shifokorlar' | 'Mening qabullarim'
  onTabChange: (tab: 'Shifokorlar' | 'Mening qabullarim') => void
  language: Language
  onLanguageChange: (value: Language) => void
}

export function Header({
  searchTerm,
  onSearchChange,
  bookingCount,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F19]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Prescripto Pro</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Medical Platform</p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 ease-in-out focus-within:border-cyan-400/70 focus-within:shadow-lg focus-within:shadow-cyan-500/10">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Shifokor, klinika yoki simptom bo’yicha qidiring"
              className="w-full border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-sm sm:flex">
            {(['UZ', 'RU', 'EN'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ease-in-out ${
                  language === lang
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <a
            href="#telemedicine"
            className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-emerald-500/20 sm:inline-flex"
          >
            <Video className="h-4 w-4" />
            Telemeditsina
          </a>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-cyan-500/20 sm:inline-flex"
          >
            <ShieldPlus className="h-4 w-4" />
            Shoshilinch qabul
          </button>

          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 shadow-sm">
            <Bell className="h-4 w-4" />
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8, ease: 'easeInOut' }}
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white"
            >
              {bookingCount}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 pb-3 sm:px-6 lg:px-8">
        <nav className="flex w-full max-w-xl items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 shadow-sm backdrop-blur-md">
          {(['Shifokorlar', 'Mening qabullarim'] as const).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
