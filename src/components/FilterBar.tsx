import { SlidersHorizontal } from 'lucide-react'
import type { FilterState } from '../types'
import { specialtyOptions } from '../data/doctors'

type FilterBarProps = {
  filters: FilterState
  onChange: React.Dispatch<React.SetStateAction<FilterState>>
}

const priceMarks = [0, 150000, 250000, 350000]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-slate-800">
        <SlidersHorizontal className="h-4 w-4 text-blue-600" />
        <h3 className="text-base font-semibold">Filtrlash</h3>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-600">Mutaxassislik</p>
          <div className="flex flex-wrap gap-2">
            {specialtyOptions.map((specialty) => {
              const isActive = filters.selectedSpecialty === specialty

              return (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => updateFilter('selectedSpecialty', specialty)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {specialty}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Minimal narx</label>
            <input
              type="range"
              min={0}
              max={350000}
              step={50000}
              value={filters.minPrice}
              onChange={(event) =>
                updateFilter('minPrice', Math.min(Number(event.target.value), filters.maxPrice - 50000))
              }
              className="w-full accent-blue-600"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              {priceMarks.map((mark) => (
                <span key={mark}>{mark.toLocaleString('uz-UZ')}</span>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Maksimal narx</label>
            <input
              type="range"
              min={150000}
              max={350000}
              step={50000}
              value={filters.maxPrice}
              onChange={(event) =>
                updateFilter('maxPrice', Math.max(Number(event.target.value), filters.minPrice + 50000))
              }
              className="w-full accent-blue-600"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>{filters.minPrice.toLocaleString('uz-UZ')}</span>
              <span>{filters.maxPrice.toLocaleString('uz-UZ')}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Minimal reyting</label>
            <select
              value={filters.minRating}
              onChange={(event) => updateFilter('minRating', Number(event.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            >
              <option value={0}>Har qanday</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
              <option value={4.8}>4.8+</option>
            </select>
          </div>
        </div>

        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Bugun mavjud bo‘lganlar</span>
          <input
            type="checkbox"
            checked={filters.availabilityToday}
            onChange={(event) => updateFilter('availabilityToday', event.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
        </label>
      </div>
    </div>
  )
}
