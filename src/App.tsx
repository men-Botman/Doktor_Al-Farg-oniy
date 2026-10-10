import { AnimatePresence, motion } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { BrainCircuit, CalendarCheck2, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ParticleCanvas } from './components/ParticleCanvas'
import { DoctorGrid } from './components/DoctorGrid'
import { DoctorModal } from './components/DoctorModal'
import { Navbar } from './components/Navbar'
import { MyAppointments } from './components/MyAppointments'
import { Preloader } from './components/Preloader'
import { SpecialtyFilter } from './components/SpecialtyFilter'
import { SymptomAIModal } from './components/SymptomAIModal'
import { useAppointments } from './context/AppointmentContext'
import { useLanguage } from './context/LanguageContext'
import { useTheme } from './context/ThemeContext'
import { doctors } from './data/doctors'
import type { BookingPayload, Doctor, FilterState } from './types'

const initialFilters: FilterState = {
  selectedSpecialty: 'Barchasi',
  searchTerm: '',
  minPrice: 0,
  maxPrice: 500000,
  minRating: 0,
  availabilityToday: false,
}

function App() {
  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments'>('doctors')
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showAI, setShowAI] = useState(false)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2000)
    return () => window.clearTimeout(timer)
  }, [])

  const { appointments, addAppointment, removeAppointment, updateAppointmentStatus, addReview, calculateDiscount } = useAppointments()

  const filteredDoctors = useMemo(() => {
    const query = filters.searchTerm.trim().toLowerCase()

    return doctors.filter((doctor) => {
      const matchesSpecialty =
        filters.selectedSpecialty === 'Barchasi' || doctor.specialty === filters.selectedSpecialty
      const matchesPrice = doctor.fee >= filters.minPrice && doctor.fee <= filters.maxPrice
      const matchesRating = doctor.rating >= filters.minRating
      const matchesAvailability = !filters.availabilityToday || doctor.availableToday
      const matchesSearch =
        !query ||
        `${doctor.name} ${doctor.clinic} ${doctor.location.city} ${doctor.location.address} ${doctor.specialty}`
          .toLowerCase()
          .includes(query)

      return matchesSpecialty && matchesPrice && matchesRating && matchesAvailability && matchesSearch
    })
  }, [filters])

  const handleBookingSubmit = (payload: BookingPayload) => {
    const { finalFee = 0 } = calculateDiscount(payload.promoCode ?? '', payload.finalFee ?? 0)
    addAppointment({
      ...payload,
      finalFee: finalFee || payload.finalFee || 0,
    })

    setSelectedDoctor(null)

    const successMessage = payload.confirmationCode
      ? t('toast.bookingCode', { code: payload.confirmationCode })
      : t('toast.booking')

    toast.success(successMessage, { duration: 3200 })
  }

  const handleReviewSubmit = (doctorId: string, review: { patientName: string; rating: number; comment: string }) => {
    addReview(doctorId, review)
    toast.success(t('toast.review'), { duration: 2800 })
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Preloader key="preloader" loading={loading} />
      ) : (
        <motion.div
          key="app-shell"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <ParticleCanvas specialty={filters.selectedSpecialty} theme={theme} />

            <div className="relative z-10">
              <Navbar
                searchTerm={filters.searchTerm}
                onSearchChange={(value) => setFilters((current) => ({ ...current, searchTerm: value }))}
                bookingCount={appointments.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                language={language}
                onLanguageChange={setLanguage}
                theme={theme}
                onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />

              <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Toaster position="top-right" toastOptions={{ duration: 2800 }} />

                {activeTab === 'doctors' ? (
                  <>
                    <section
                      className={`mb-8 overflow-hidden rounded-[30px] border p-6 shadow-[0_25px_80px_rgba(59,130,246,0.12)] backdrop-blur-2xl md:p-8 ${
                        theme === 'dark'
                          ? 'border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-blue-600/15 to-violet-500/15 text-white'
                          : 'border-blue-100 bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-500 text-white'
                      }`}
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                            <Sparkles className="h-4 w-4" />
                            {t('hero.badge')}
                          </div>
                          <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-5xl">
                            {t('hero.title')}
                          </h1>
                          <p className="mt-3 max-w-lg text-sm text-blue-50 md:text-base">{t('hero.description')}</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => setShowAI(true)}
                            className="inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20"
                          >
                            <BrainCircuit className="h-4 w-4" />
                            {t('hero.ai')}
                          </button>
                          <button
                            type="button"
                            className="inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
                          >
                            <CalendarCheck2 className="h-4 w-4" />
                            {t('hero.emergency')}
                          </button>
                        </div>
                      </div>
                    </section>

                    <section className="mb-6">
                      <SpecialtyFilter filters={filters} onChange={setFilters} />
                    </section>

                    <section>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-400">{t('hero.topDoctors')}</p>
                          <h2 className={`mt-2 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {t('hero.nearby')}
                          </h2>
                        </div>
                        <div className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm ${theme === 'dark' ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-600'}`}>
                          <Search className="h-4 w-4 text-cyan-400" />
                          {filteredDoctors.length} {t('nav.results')}
                        </div>
                      </div>

                      {filteredDoctors.length > 0 ? (
                        <DoctorGrid doctors={filteredDoctors} onBook={setSelectedDoctor} />
                      ) : (
                        <div className={`rounded-[28px] border border-dashed p-10 text-center shadow-sm backdrop-blur-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-slate-300 bg-white text-slate-800'}`}>
                          <p className="text-lg font-semibold">{t('hero.noResults')}</p>
                          <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{t('hero.noResultsSub')}</p>
                        </div>
                      )}
                    </section>
                  </>
                ) : (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-400">{t('nav.appointments')}</p>
                        <h2 className={`mt-2 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {t('appointments.title')}
                        </h2>
                      </div>
                    </div>

                    <MyAppointments
                      appointments={appointments}
                      onCancel={(id) => {
                        removeAppointment(id)
                        toast.success(t('toast.cancelled'), { duration: 2200 })
                      }}
                      onStatusChange={updateAppointmentStatus}
                    />
                  </section>
                )}
              </main>

              {selectedDoctor && (
                <DoctorModal
                  doctor={selectedDoctor}
                  onClose={() => setSelectedDoctor(null)}
                  onBook={handleBookingSubmit}
                  onReviewSubmit={handleReviewSubmit}
                />
              )}

              <SymptomAIModal doctors={doctors} isOpen={showAI} onClose={() => setShowAI(false)} onSelectDoctor={setSelectedDoctor} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
