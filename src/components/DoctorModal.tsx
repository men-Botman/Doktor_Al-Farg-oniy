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
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import type { BookingPayload, Doctor, ReviewSubmission } from '../types'

const specialtyIcons = {
  'LOR (Otolaringolog)': Stethoscope,
  Stomatolog: Stethoscope,
  Kardiolog: HeartPulse,
  Nevropatolog: BrainIcon,
  Pediatr: ShieldCheck,
  Oftalmolog: Eye,
  Dermatolog: ShieldCheck,
  Xirurg: HeartPulse,
} as const

function BrainIcon(props: React.ComponentProps<typeof Stethoscope>) {
  return <Stethoscope {...props} />
}

type Tabs = 'overview' | 'slots' | 'location' | 'reviews'

type DoctorModalProps = {
  doctor: Doctor | null
  onClose: () => void
  onBook: (payload: BookingPayload) => void
  onReviewSubmit: (doctorId: string, review: ReviewSubmission) => void
}

export function DoctorModal({ doctor, onClose, onBook, onReviewSubmit }: DoctorModalProps) {
  const { language, t } = useLanguage()
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

  if (!doctor) return null

  const SpecialtyIcon = specialtyIcons[doctor.specialty] ?? Stethoscope
  const averageReview = doctor.reviews.length
    ? doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length
    : 0

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!patientName.trim() || !phone.trim()) {
      return
    }

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
      confirmationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      finalFee: doctor.fee,
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

  const tabLabels: Record<Tabs, string> = {
    overview: t('modal.overview'),
    slots: t('modal.slots'),
    location: t('modal.location'),
    reviews: t('modal.reviews'),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={doctor.image} alt={doctor.name} className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-600">{t('modal.profile')}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{doctor.name}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer select-none rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {(['overview', 'slots', 'location', 'reviews'] as Tabs[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer select-none rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
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
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('doctor.experience')}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{doctor.experience} yil</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('doctor.rating')}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{doctor.rating.toFixed(1)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('doctor.fee')}</p>
                      <p className="mt-2 text-lg font-bold text-blue-700">{doctor.fee.toLocaleString('uz-UZ')} UZS</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{t('modal.profile')}</h3>
                  <p className="text-sm leading-7 text-slate-600">{doctor.bio}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-800">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold">{t('modal.schedule')}</h3>
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
                    <h3 className="font-semibold">{t('modal.chooseDate')}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {dates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`cursor-pointer select-none rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                          selectedDate === date
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {new Date(date).toLocaleDateString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
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
                    <h3 className="font-semibold">{t('modal.chooseTime')}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`cursor-pointer select-none rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
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
                      <p className="text-sm text-slate-500">{t('doctor.location')}</p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-900">{doctor.location.distanceKm} km</h3>
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
                    {t('modal.map')}
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{t('modal.overallRating')}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-2xl font-bold text-slate-900">{averageReview.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {doctor.reviews.length} {t('modal.reviewCount')}
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
                                className={`h-4 w-4 ${index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {t('modal.verified')}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">{t('modal.reviewTitle')}</h3>
                  <div className="mt-4 grid gap-4">
                    <input
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      placeholder={t('modal.patientName')}
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
                            className="cursor-pointer select-none transition-transform hover:scale-105"
                          >
                            <Star
                              className={`h-5 w-5 ${value <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          </button>
                        )
                      })}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      rows={4}
                      placeholder={t('modal.reviewEmpty')}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-100 hover:bg-blue-700"
                    >
                      <MessageSquareText className="h-4 w-4" />
                      {t('modal.reviewSubmit')}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-semibold text-slate-900">{t('modal.booking')}</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4 text-blue-600" />
                  {t('modal.patientName')}
                </span>
                <input
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder={t('modal.patientPlaceholder')}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone className="h-4 w-4 text-blue-600" />
                  {t('modal.phone')}
                </span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder={t('modal.phonePlaceholder')}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MessageSquareText className="h-4 w-4 text-blue-600" />
                  {t('modal.notes')}
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                  placeholder={t('modal.notesPlaceholder')}
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-600" />
                  {t('modal.telegram')}
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
                  placeholder={t('modal.telegramPlaceholder')}
                />
              )}

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{t('modal.chooseDate')}</span>
                  <span className="font-medium text-slate-900">{new Date(selectedDate).toLocaleDateString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{t('modal.chooseTime')}</span>
                  <span className="font-medium text-slate-900">{selectedSlot}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{t('doctor.fee')}</span>
                  <span className="font-bold text-blue-700">{doctor.fee.toLocaleString('uz-UZ')} UZS</span>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-100 hover:bg-blue-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t('modal.submitBooking')}
              </button>
            </form>
          </aside>
        </div>
      </motion.div>
    </div>
  )
}
