import { Clock3, MapPin, Star, WalletCards } from 'lucide-react'
import type { Doctor } from '../types'

type DoctorCardProps = {
  doctor: Doctor
  onBook: (doctor: Doctor) => void
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
          {doctor.specialty}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{doctor.clinic}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700">
            <Star className="h-3.5 w-3.5 fill-current" />
            {doctor.rating}
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-blue-600" />
            <span>{doctor.experience} yil tajriba</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>{doctor.location}</span>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{doctor.bio}</p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 text-blue-700">
            <WalletCards className="h-4 w-4" />
            <span className="text-lg font-bold">{doctor.fee.toLocaleString('uz-UZ')} UZS</span>
          </div>

          <button
            type="button"
            onClick={() => onBook(doctor)}
            className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
          >
            Qabulga yozilish
          </button>
        </div>
      </div>
    </article>
  )
}
