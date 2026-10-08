import { CalendarDays, Clock3, MapPin, Phone, Trash2 } from 'lucide-react'
import type { Appointment } from '../types'

type MyAppointmentsProps = {
  appointments: Appointment[]
  onCancel: (id: string) => void
}

const badgeClasses: Record<Appointment['status'], string> = {
  Kutilmoqda: 'bg-amber-100 text-amber-700',
  Tasdiqlandi: 'bg-emerald-100 text-emerald-700',
}

export function MyAppointments({ appointments, onCancel }: MyAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-800">Hozircha qabullar yo'q</p>
        <p className="mt-2 text-sm text-slate-500">Shifokorlar bo'limidan eng yaqin vaqtda qabulga yoziling.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <article key={appointment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-slate-900">{appointment.doctorName}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClasses[appointment.status]}`}>
                  {appointment.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{appointment.doctorSpecialty}</p>
            </div>

            <button
              type="button"
              onClick={() => onCancel(appointment.id)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Bekor qilish
            </button>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <span>{new Date(appointment.date).toLocaleDateString('uz-UZ')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <Clock3 className="h-4 w-4 text-blue-600" />
              <span>{appointment.slot}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{appointment.clinic}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>{appointment.phone}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <span className="font-medium text-slate-800">Bemor:</span> {appointment.patientName}
          </div>
        </article>
      ))}
    </div>
  )
}
