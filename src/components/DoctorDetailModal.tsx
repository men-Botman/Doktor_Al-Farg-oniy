import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  HeartPulse,
  MapPin,
  MessageSquareText,
  Navigation,
  Phone,
  Send,
  ShieldCheck,
  Star,
  Stethoscope,
  User,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { BookingPayload, Doctor, ReviewSubmission } from '../types'

type Tabs = 'overview' | 'slots' | 'location' | 'reviews'

const specialtyIcons = {
  'LOR (Otolaringolog)': EarIcon,
  Stomatolog: Stethoscope,
  Kardiolog: HeartPulse,
  Nevropatolog: BrainIcon,
  Pediatr: BabyIcon,
  Oftalmolog: Eye,
  Dermatolog: ShieldCheck,
  Xirurg: HeartPulse,
} as const

type DoctorDetailModalProps = {
  doctor: Doctor | null
  onClose: () => void
  onBook: (payload: BookingPayload) => void
  onReviewSubmit: (doctorId: string, review: ReviewSubmission) => void
}

function EarIcon(props: React.ComponentProps<typeof Stethoscope>) {
  return <Stethoscope {...props} />
}

function BrainIcon(props: React.ComponentProps<typeof Stethoscope>) {
  return <Stethoscope {...props} />
}

function BabyIcon(props: React.ComponentProps<typeof Stethoscope>) {
  return <Stethoscope {...props} />
}

export function DoctorDetailModal({ doctor, onClose, onBook, onReviewSubmit }: DoctorDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tabs>('overview')
  const [selectedDate, setSelectedDate] = useState(doctor?.availableDates[0] ?? '')
  const [selectedSlot, setSelectedSlot] = useState(doctor?.slots[0] ?? '')
  const [patientName, setPatientName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [telegramEnabled, setTelegramEnabled] = useState(false)
  const [telegramHandle, setTelegramHandle] = useState('')
  const [reviewName, setReviewName] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  const dates = useMemo(() => doctor?.availableDates ?? [], [doctor])
  const slots = useMemo(() => doctor?.slots ?? [], [doctor])

  if (!doctor) {
    return null
  }

  const name = doctor.name
  const SpecialtyIcon = specialtyIcons[doctor.specialty] ?? Stethoscope
  const averageReview =
    doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / (doctor.reviews.length || 1)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!patientName.trim() || !phone.trim()) {
      return
    }

    const confirmationCode = `${Math.floor(1000 + Math.random() * 9000)}`

    onBook({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      clinic: doctor.clinic,
      date: selectedDate,
      slot: selectedSlot,
      patientName: patientName.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
      telegramEnabled,
      telegramHandle: telegramEnabled ? telegramHandle.trim() || undefined : undefined,
      confirmationCode,
    })
  }

  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!reviewName.trim() || !reviewComment.trim()) {
      return
    }

    onReviewSubmit(doctor.id, {
      patientName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    })

    setReviewName('')
    setReviewComment('')
    setReviewRating(5)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={doctor.image} alt={name} className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Shifokor profili</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{name}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Yopish
          </button>
        </div>

        <div className="border-b border-slate-200 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {(['overview', 'slots', 'location', 'reviews'] as Tabs[]).map((tab) => {
              const labels = {
                overview: 'Umumiy',
                slots: 'Mavjud vaqtlar',
                location: 'Manzil',
                reviews: 'Bemorlar fikrlari',
              }

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {labels[tab]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <SpecialtyIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{doctor.title}</p>
                      <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {doctor.specialty}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tajriba</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{doctor.experience} yil</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reyting</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{doctor.rating.toFixed(1)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Narx</p>
                      <p className="mt-2 text-lg font-bold text-blue-700">{doctor.fee.toLocaleString('uz-UZ')} UZS</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Kasbiy ma'lumot</h3>
                  <p className="text-sm leading-7 text-slate-600">{doctor.bio}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-800">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold">Ish vaqti</h3>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    {doctor.workSchedule.map((schedule) => (
                      <div key={schedule} className="rounded-xl bg-slate-50 px-3 py-2">
                        {schedule}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'slots' && (
              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-slate-700">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold">Sana tanlang</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {dates.map((date) => (
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
                        {new Date(date).toLocaleDateString('uz-UZ', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-slate-700">
                    <Clock3 className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold">Vaqt oralig'i</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
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
            )}

            {activeTab === 'location' && (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-sky-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Masofasi</p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-900">{doctor.location.distanceKm} km uzoqlikda</h3>
                    </div>
                    <div className="rounded-full bg-white p-2 text-blue-600 shadow-sm">
                      <Navigation className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">{doctor.clinic}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{doctor.location.address}</p>
                  <p className="mt-1 text-sm text-slate-500">{doctor.location.city}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.location.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 hover:bg-blue-700"
                  >
                    <MapPin className="h-4 w-4" />
                    Xaritada ko'rish
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Umumiy reyting</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-2xl font-bold text-slate-900">{averageReview.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {doctor.reviews.length} ta fikr
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {doctor.reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-800">{review.patientName}</p>
                          <div className="mt-1 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={`${review.id}-${index}`}
                                className={`h-4 w-4 ${
                                  index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Tasdiqlangan
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">Fikr qoldirish</h3>
                  <div className="mt-4 grid gap-4">
                    <input
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      placeholder="Ismingiz"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setReviewRating(value)}
                            className="transition-transform hover:scale-105"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                value <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        )
                      })}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      rows={4}
                      placeholder="Qabul haqida fikringizni qoldiring..."
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-100 hover:bg-blue-700"
                    >
                      <MessageSquareText className="h-4 w-4" />
                      Fikr qoldirish
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Qabulga yozilish</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4 text-blue-600" />
                  Bemor ismi
                </span>
                <input
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Misol: Feruza Karimova"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder="+998 90 123 45 67"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MessageSquareText className="h-4 w-4 text-blue-600" />
                  Shikoyat / eslatma
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder="Masalan: Tomoq og'rig'i, LOR ko'rigi"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-600" />
                  Telegram orqali eslatma olish
                </span>
                <input
                  type="checkbox"
                  checked={telegramEnabled}
                  onChange={(event) => setTelegramEnabled(event.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
              </label>

              {telegramEnabled && (
                <input
                  value={telegramHandle}
                  onChange={(event) => setTelegramHandle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder="@username yoki telefon raqam"
                />
              )}

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Sana</span>
                  <span className="font-medium text-slate-900">
                    {new Date(selectedDate).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Vaqt</span>
                  <span className="font-medium text-slate-900">{selectedSlot}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Narx</span>
                  <span className="font-bold text-blue-700">{doctor.fee.toLocaleString('uz-UZ')} UZS</span>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-100 hover:bg-blue-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Qabulni tasdiqlash
              </button>
            </form>
          </aside>
        </div>
      </div>
    </div>
  )
}
