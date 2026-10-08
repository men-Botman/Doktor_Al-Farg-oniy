import { Search, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BookingModal } from './components/BookingModal'
import { CategoryFilter } from './components/CategoryFilter'
import { DoctorCard } from './components/DoctorCard'
import { MyAppointments } from './components/MyAppointments'
import { Navbar } from './components/Navbar'
import { doctors } from './data/doctors'
import { useAppointments } from './context/AppointmentContext'
import type { Doctor, Specialty } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<'Shifokorlar' | 'Mening qabullarim'>('Shifokorlar')
  const [selectedCategory, setSelectedCategory] = useState<Specialty | 'Barchasi'>('Barchasi')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const { appointments, addAppointment, removeAppointment } = useAppointments()

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return doctors.filter((doctor) => {
      const matchesCategory =
        selectedCategory === 'Barchasi' || doctor.specialty === selectedCategory

      const searchableText = `${doctor.name} ${doctor.location} ${doctor.clinic}`.toLowerCase()
      const matchesSearch = !query || searchableText.includes(query)

      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategory])

  const handleBookingSubmit = (payload: {
    doctorId: string
    doctorName: string
    doctorSpecialty: string
    clinic: string
    date: string
    slot: string
    patientName: string
    phone: string
  }) => {
    addAppointment({
      ...payload,
      doctorId: payload.doctorId,
      doctorName: payload.doctorName,
      doctorSpecialty: payload.doctorSpecialty,
      clinic: payload.clinic,
      date: payload.date,
      slot: payload.slot,
      patientName: payload.patientName,
      phone: payload.phone,
    })

    setSelectedDoctor(null)
    setToast('Qabul muvaffaqiyatli saqlandi!')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        appointmentCount={appointments.length}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {toast && (
          <div className="mb-6 flex justify-end">
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              {toast}
            </div>
          </div>
        )}

        {activeTab === 'Shifokorlar' ? (
          <>
            <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-600 to-sky-500 p-6 text-white shadow-lg shadow-blue-100 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    24/7 virtual qabul
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                    O'zingizga mos shifokorni tanlang
                  </h1>
                  <p className="mt-3 max-w-lg text-sm text-blue-50 md:text-base">
                    Soha mutaxassislari bilan tez va qulay qabulga yoziling. Toshkentda va butun mamlakat bo'yicha eng yaxshi klinikalar.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-md shadow-blue-900/10">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Ishonchli xizmat
                  </div>
                  <p className="mt-2 text-3xl font-bold">12k+</p>
                  <p className="text-sm text-slate-500">muvaffaqiyatli qabul</p>
                </div>
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Shifokor yoki klinika nomini qidiring"
                  className="w-full border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </label>
            </section>

            <section className="mb-6">
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </section>

            <section>
              {filteredDoctors.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBook={setSelectedDoctor} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                  <p className="text-lg font-semibold text-slate-800">Hech qanday shifokor topilmadi</p>
                  <p className="mt-2 text-sm text-slate-500">Boshqa soha yoki qidiruv so'zini sinab ko'ring.</p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Mening qabullarim</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Qayd etilgan qabullar</h2>
              </div>
            </div>

            <MyAppointments
              appointments={appointments}
              onCancel={(id) => {
                removeAppointment(id)
                setToast('Qabul bekor qilindi.')
              }}
            />
          </section>
        )}
      </main>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  )
}

export default App
