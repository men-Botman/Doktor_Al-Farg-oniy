import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getSpecialtyLabel } from '../i18n/translations'
import type { FilterState, Specialty } from '../types'

const specialtyPills: Specialty[] = [
  'Barchasi',
  'LOR (Otolaringolog)',
  'Stomatolog',
  'Kardiolog',
  'Nevropatolog',
  'Pediatr',
  'Oftalmolog',
  'Dermatolog',
  'Xirurg',
] as Specialty[]

type SpecialtyFilterProps = {
  filters: FilterState
  onChange: Dispatch<SetStateAction<FilterState>>
}

export function SpecialtyFilter({ filters, onChange }: SpecialtyFilterProps) {
  const { language, t } = useLanguage()

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(6,182,212,0.08)] backdrop-blur-2xl sm:p-5">
      <div className="mb-5 flex items-center gap-2 text-white">
        <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
        <h3 className="font-semibold">{t('filters.department')} & {t('filters.all')}</h3>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-300">{t('filters.department')}</p>
          <div className="flex flex-wrap gap-2">
            {specialtyPills.map((specialty) => {
              const isActive = filters.selectedSpecialty === specialty

              return (
                <motion.button
                  key={specialty}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                  onClick={() => update('selectedSpecialty', specialty)}
                  className={`cursor-pointer select-none rounded-full border px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                    isActive
                      ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/30'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {getSpecialtyLabel(specialty, language)}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">{t('filters.minPrice')}</label>
            <input
              type="range"
              min={0}
              max={500000}
              step={50000}
              value={filters.minPrice}
              onChange={(event) => update('minPrice', Number(event.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-2 text-xs text-slate-400">{filters.minPrice.toLocaleString('uz-UZ')} UZS</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">{t('filters.maxPrice')}</label>
            <input
              type="range"
              min={100000}
              max={500000}
              step={50000}
              value={filters.maxPrice}
              onChange={(event) => update('maxPrice', Number(event.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-2 text-xs text-slate-400">{filters.maxPrice.toLocaleString('uz-UZ')} UZS</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">{t('filters.minRating')}</label>
            <select
              value={filters.minRating}
              onChange={(event) => update('minRating', Number(event.target.value))}
              className="w-full cursor-pointer select-none rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition duration-300 ease-in-out focus:border-cyan-400"
            >
              <option value={0}>{t('filters.any')}</option>
              <option value={4}>{t('filters.score')}</option>
              <option value={4.5}>{t('filters.score2')}</option>
              <option value={4.8}>{t('filters.score3')}</option>
            </select>
          </div>
        </div>

        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
          <span>{t('filters.todayOnly')}</span>
          <input
            type="checkbox"
            checked={filters.availabilityToday}
            onChange={(event) => update('availabilityToday', event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-blue-600"
          />
        </label>
      </div>
    </div>
  )
}
