import { BrainCircuit, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Doctor } from '../types'

type SymptomAIModalProps = {
  doctors: Doctor[]
  isOpen: boolean
  onClose: () => void
  onSelectDoctor: (doctor: Doctor) => void
}

const symptomMap: Record<string, string[]> = {
  'tomoq og\'rig\'i': ['LOR (Otolaringolog)'],
  'tish og\'rig\'i': ['Stomatolog'],
  'qon bosimi': ['Kardiolog'],
  'migren': ['Nevropatolog'],
  'bola': ['Pediatr'],
  'ko\'z': ['Oftalmolog'],
  'teri': ['Dermatolog'],
  'sirtdagi og\'riq': ['Xirurg'],
}

export function SymptomAIModal({ doctors, isOpen, onClose, onSelectDoctor }: SymptomAIModalProps) {
  const [symptomInput, setSymptomInput] = useState('')

  const matches = useMemo(() => {
    if (!symptomInput.trim()) {
      return doctors.slice(0, 3)
    }

    const normalized = symptomInput.toLowerCase()
    const specialties = Object.entries(symptomMap).flatMap(([ symptom, specialties ]) =>
      normalized.includes(symptom) ? specialties : [],
    )

    if (specialties.length === 0) {
      return doctors.filter((doctor) => doctor.name.toLowerCase().includes(normalized)).slice(0, 3)
    }

    return doctors.filter((doctor) => specialties.includes(doctor.specialty)).slice(0, 3)
  }, [doctors, symptomInput])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">AI Match</p>
              <h3 className="text-xl font-bold text-slate-900">Simptomlar bo’yicha tanlash</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Simptomni kiriting</span>
          <textarea
            rows={3}
            value={symptomInput}
            onChange={(event) => setSymptomInput(event.target.value)}
            placeholder="Masalan: tomoq og'rig'i yoki tish og'rig'i"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
          />
        </label>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Tavsiya etilgan shifokorlar
          </div>

          <div className="space-y-3">
            {matches.map((doctor) => (
              <button
                key={doctor.id}
                type="button"
                onClick={() => {
                  onSelectDoctor(doctor)
                  onClose()
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <img src={doctor.image} alt={doctor.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{doctor.name}</p>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-700">Tanlash</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
