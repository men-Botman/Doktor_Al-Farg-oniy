import type { Specialty } from '../types'

type CategoryFilterProps = {
  selected: Specialty | 'Barchasi'
  onSelect: (value: Specialty | 'Barchasi') => void
}

const categories: Array<Specialty | 'Barchasi'> = [
  'Barchasi',
  'LOR (Otolaringolog)',
  'Stomatolog',
  'Kardiolog',
  'Nevropatolog',
  'Pediatr',
  'Oftalmolog',
  'Dermatolog',
  'Xirurg',
]

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-3">
        {categories.map((category) => {
          const isActive = selected === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
