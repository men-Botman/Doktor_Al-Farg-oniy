import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Navigation,
  Sparkles,
  Star,
  WalletCards,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { getSpecialtyLabel } from '../i18n/translations'
import type { Doctor } from '../types'

const specialtyStyles = {
  'LOR (Otolaringolog)': 'bg-violet-100 text-violet-700',
  Stomatolog: 'bg-cyan-100 text-cyan-700',
  Kardiolog: 'bg-rose-100 text-rose-700',
  Nevropatolog: 'bg-amber-100 text-amber-700',
  Pediatr: 'bg-emerald-100 text-emerald-700',
  Oftalmolog: 'bg-indigo-100 text-indigo-700',
  Dermatolog: 'bg-pink-100 text-pink-700',
  Xirurg: 'bg-slate-100 text-slate-700',
} as const

type DoctorCardProps = {
  doctor: Doctor
  onBook: (doctor: Doctor) => void
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const { language, t } = useLanguage()

  return (
    <motion.article
      layout
      whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="group cursor-pointer select-none flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(6,182,212,0.08)] backdrop-blur-2xl transition-all duration-300 ease-in-out hover:border-cyan-400/40 hover:shadow-[0_30px_80px_rgba(59,130,246,0.18)]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div
          className={`absolute left-4 top-4 flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm ${
            specialtyStyles[doctor.specialty] ?? 'bg-white/90 text-slate-700'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>{getSpecialtyLabel(doctor.specialty, language)}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{doctor.clinic}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-sm font-medium text-amber-300">
            <Star className="h-3.5 w-3.5 fill-current" />
            {doctor.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-blue-600" />
            <span>
              {doctor.experience} {t('doctor.experience')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>{doctor.location.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            <span>
              {doctor.location.distanceKm} {t('doctor.distance')}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm">
          <span className="text-slate-400">{t('doctor.nextSlot')}</span>
          <span className="font-semibold text-white">{doctor.slots[0]}</span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{doctor.bio}</p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-cyan-300">
            <WalletCards className="h-4 w-4" />
            <span className="text-lg font-bold">{doctor.fee.toLocaleString('uz-UZ')} UZS</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onBook(doctor)}
            className="inline-flex cursor-pointer select-none items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out hover:shadow-cyan-500/30"
          >
            {t('doctor.book')}
            <ArrowUpRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
