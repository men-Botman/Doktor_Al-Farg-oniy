import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Appointment, AppointmentStatus, BookingPayload, Review, ReviewSubmission } from '../types'

const APPOINTMENTS_KEY = 'prescripto-appointments-v1'
const REVIEWS_KEY = 'prescripto-reviews-v1'

const promoPatterns: Record<string, number> = {
  SAVE10: 0.1,
  DOCTOR15: 0.15,
  FIRST20: 0.2,
}

type AppointmentContextValue = {
  appointments: Appointment[]
  reviewsByDoctor: Record<string, Review[]>
  addAppointment: (appointment: BookingPayload) => void
  removeAppointment: (id: string) => void
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
  addReview: (doctorId: string, review: ReviewSubmission) => void
  calculateDiscount: (promoCode: string, fee: number) => { discount: number; finalFee: number; appliedRate: number }
}

const AppointmentContext = createContext<AppointmentContextValue | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const stored = window.localStorage.getItem(APPOINTMENTS_KEY)
      return stored ? (JSON.parse(stored) as Appointment[]) : []
    } catch {
      return []
    }
  })

  const [reviewsByDoctor, setReviewsByDoctor] = useState<Record<string, Review[]>>(() => {
    if (typeof window === 'undefined') {
      return {}
    }

    try {
      const stored = window.localStorage.getItem(REVIEWS_KEY)
      return stored ? (JSON.parse(stored) as Record<string, Review[]>) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviewsByDoctor))
  }, [reviewsByDoctor])

  const calculateDiscount = useCallback((promoCode: string, fee: number) => {
    const normalized = promoCode.trim().toUpperCase()
    const rate = promoPatterns[normalized] ?? 0
    const discount = fee * rate
    const finalFee = fee - discount

    return {
      discount,
      finalFee,
      appliedRate: rate,
    }
  }, [])

  const addAppointment = useCallback(
    (appointment: BookingPayload) => {
      const fee = appointment.finalFee ?? appointment.doctorId.length * 0
      const nextAppointment: Appointment = {
        ...appointment,
        id: crypto.randomUUID(),
        status: 'Kutilmoqda',
        createdAt: new Date().toISOString(),
        confirmationCode: appointment.confirmationCode ?? `${Math.floor(1000 + Math.random() * 9000)}`,
        videoLink: `https://meet.jit.si/doctor-${appointment.doctorId}-${Date.now()}`,
        finalFee: fee || 0,
      }

      setAppointments((current) => [nextAppointment, ...current])
    },
    [calculateDiscount],
  )

  const removeAppointment = useCallback((id: string) => {
    setAppointments((current) => current.filter((appointment) => appointment.id !== id))
  }, [])

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
            }
          : appointment,
      ),
    )
  }, [])

  const addReview = useCallback((doctorId: string, review: ReviewSubmission) => {
    const newReview: Review = {
      id: crypto.randomUUID(),
      patientName: review.patientName,
      rating: review.rating,
      comment: review.comment,
      verified: true,
      date: new Date().toISOString(),
    }

    setReviewsByDoctor((current) => ({
      ...current,
      [doctorId]: [newReview, ...(current[doctorId] ?? [])],
    }))
  }, [])

  const value = useMemo(
    () => ({ appointments, reviewsByDoctor, addAppointment, removeAppointment, updateAppointmentStatus, addReview, calculateDiscount }),
    [addAppointment, addReview, appointments, calculateDiscount, removeAppointment, reviewsByDoctor, updateAppointmentStatus],
  )

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>
}

export function useAppointments() {
  const context = useContext(AppointmentContext)

  if (!context) {
    throw new Error('useAppointments must be used inside AppointmentProvider')
  }

  return context
}
