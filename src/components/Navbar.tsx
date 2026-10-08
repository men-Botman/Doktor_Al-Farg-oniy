import { CalendarDays, Stethoscope } from 'lucide-react'

type NavbarProps = {
  activeTab: 'Shifokorlar' | 'Mening qabullarim'
  onTabChange: (tab: 'Shifokorlar' | 'Mening qabullarim') => void
  appointmentCount: number
}

export function Navbar({ activeTab, onTabChange, appointmentCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur supports-[backdrop-filter]:bg-slate-50/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">Docly</p>
            <p className="text-xs text-slate-500">Salomatlik markazi</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm sm:flex">
          {(['Shifokorlar', 'Mening qabullarim'] as const).map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 md:flex">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            <span>{appointmentCount} ta qabul</span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-200">
            <span className="text-sm font-semibold">{appointmentCount}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
