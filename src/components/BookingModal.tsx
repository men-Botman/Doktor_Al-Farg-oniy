import { CalendarDays, Check, Clock3, MapPin, Phone, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Doctor } from '../types'

type BookingModalProps = {
  doctor: Doctor | null
  onClose: () => void
  onSubmit: (payload: {
    doctorId: string
    doctorName: string
    doctorSpecialty: string
    clinic: string
    date: string
    slot: string
    patientName: string
    phone: string
    notes?: string
    telegramEnabled?: boolean
    telegramHandle?: string
    confirmationCode?: string
  }) => void
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function BookingModal({ doctor, onClose, onSubmit }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(doctor?.availableDates[0] ?? '')
  const [selectedSlot, setSelectedSlot] = useState<string>(doctor?.slots[0] ?? '')
  const [patientName, setPatientName] = useState('')
  const [phone, setPhone] = useState('')

  const dateOptions = useMemo(() => doctor?.availableDates ?? [], [doctor])
  const slotOptions = useMemo(() => doctor?.slots ?? [], [doctor])

  if (!doctor) {
    return null
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!patientName.trim() || !phone.trim()) {
      return
    }

    onSubmit({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      clinic: doctor.clinic,
      date: selectedDate,
      slot: selectedSlot,
      patientName: patientName.trim(),
      phone: phone.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Qabul</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{doctor.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
          >
            Yopish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <img src={doctor.image} alt={doctor.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <div className="mb-1 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {doctor.specialty}
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {doctor.clinic}, {doctor.location.address}
                </p>
                <p className="mt-1 text-sm text-slate-500">{doctor.experience} yil tajriba</p>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-semibold">Sana tanlang</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {dateOptions.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                      selectedDate === date
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <Clock3 className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-semibold">Vaqt tanlang</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {slotOptions.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      selectedSlot === slot
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-semibold text-slate-900">Bemor ma'lumoti</h3>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4 text-blue-600" />
                  Ism familya
                </span>
                <input
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  placeholder="Misol: Feruza Karimova"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Telefon raqam
                </span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Qabul:</span>
                <span className="font-medium text-slate-900">{formatDate(selectedDate)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Vaqt:</span>
                <span className="font-medium text-slate-900">{selectedSlot}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>To'lov:</span>
                <span className="font-bold text-blue-700">{doctor.fee.toLocaleString('uz-UZ')} UZS</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              Qabulni tasdiqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
