import { motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Phone,
  Trash2,
  Video,
  Wifi,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import type { Appointment, AppointmentStatus } from '../types'

type MyAppointmentsProps = {
  appointments: Appointment[]
  onCancel: (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

const badgeClasses: Record<AppointmentStatus, string> = {
  Kutilmoqda: 'bg-amber-100 text-amber-700',
  Tasdiqlandi: 'bg-emerald-100 text-emerald-700',
  Yakunlandi: 'bg-slate-200 text-slate-700',
  'Bekor qilindi': 'bg-red-100 text-red-700',
}

function buildGoogleCalendarUrl(appointment: Appointment) {
  const startDate = new Date(`${appointment.date}T${appointment.slot}:00`)
  const endDate = new Date(startDate)
  endDate.setMinutes(startDate.getMinutes() + 60)

  const format = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z')

  const summary = `${appointment.doctorName} qabul`
  const details = `Bemor: ${appointment.patientName}\nTelefon: ${appointment.phone}\nKlinika: ${appointment.clinic}\nShikoyat: ${appointment.notes ?? 'Yo‘q'}`

  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', summary)
  url.searchParams.set('details', details)
  url.searchParams.set('location', appointment.clinic)
  url.searchParams.set('dates', `${format(startDate)}/${format(endDate)}`)

  return url.toString()
}

export function MyAppointments({ appointments, onCancel, onStatusChange }: MyAppointmentsProps) {
  const { language, t } = useLanguage()
  const completed = appointments.filter((appointment) => appointment.status === 'Yakunlandi').length
  const progress = appointments.length === 0 ? 0 : (completed / appointments.length) * 100

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-800">{t('appointments.empty')}</p>
        <p className="mt-2 text-sm text-slate-500">{t('appointments.emptySub')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-2xl">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 font-medium text-white">
            <Wifi className="h-4 w-4 text-emerald-400" />
            {t('appointments.progress')}
          </span>
          <span>{completed}/{appointments.length}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600"
          />
        </div>
      </div>

      {appointments.map((appointment) => (
        <motion.article
          key={appointment.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(6,182,212,0.08)] backdrop-blur-2xl transition-shadow hover:shadow-[0_25px_60px_rgba(59,130,246,0.12)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-white">{appointment.doctorName}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClasses[appointment.status]}`}>
                  {t(`status.${appointment.status === 'Kutilmoqda' ? 'pending' : appointment.status === 'Tasdiqlandi' ? 'confirmed' : appointment.status === 'Yakunlandi' ? 'completed' : 'cancelled'}`)}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{appointment.doctorSpecialty}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={appointment.status}
                onChange={(event) => onStatusChange(appointment.id, event.target.value as AppointmentStatus)}
                className="cursor-pointer select-none rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 ease-in-out focus:border-cyan-400"
              >
                <option value="Kutilmoqda">{t('status.pending')}</option>
                <option value="Tasdiqlandi">{t('status.confirmed')}</option>
                <option value="Yakunlandi">{t('status.completed')}</option>
                <option value="Bekor qilindi">{t('status.cancelled')}</option>
              </select>

              <a
                href={buildGoogleCalendarUrl(appointment)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 ease-in-out hover:shadow-cyan-500/30"
              >
                <CalendarDays className="h-4 w-4" />
                {t('appointments.addToCalendar')}
              </a>

              {appointment.videoLink && (
                <a
                  href={appointment.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition-all duration-300 ease-in-out hover:bg-emerald-500/20"
                >
                  <Video className="h-4 w-4" />
                  {t('appointments.video')}
                </a>
              )}

              <button
                type="button"
                onClick={() => onCancel(appointment.id)}
                className="inline-flex cursor-pointer select-none items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-300 ease-in-out hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                {t('appointments.cancel')}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <CalendarDays className="h-4 w-4 text-cyan-400" />
              <span>{new Date(appointment.date).toLocaleDateString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <Clock3 className="h-4 w-4 text-cyan-400" />
              <span>{appointment.slot}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span>{appointment.clinic}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>{appointment.phone}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-white">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold">{t('appointments.medicalHistory')}</span>
              </div>
              <p className="mt-2 leading-6 text-slate-300">{appointment.notes || t('appointments.noSymptoms')}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold">{t('appointments.plan')}</span>
              </div>
              <ul className="mt-2 space-y-2 text-slate-300">
                <li>• {t('common.today')}</li>
                <li>• {t('appointments.plan')}</li>
                <li>• {t('appointments.video')}</li>
                <li>• {t('doctor.fee')}: {appointment.finalFee?.toLocaleString('uz-UZ') ?? '—'} UZS</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
            <span className="font-medium text-white">{t('appointments.patient')}:</span> {appointment.patientName}
            {appointment.telegramHandle && (
              <span className="ml-3 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
                {t('appointments.telegram')}: {appointment.telegramHandle}
              </span>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  )
}
