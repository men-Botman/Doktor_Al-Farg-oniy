import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Appointment } from '../types'

const STORAGE_KEY = 'doctor-appointments'

type AppointmentContextValue = {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void
  removeAppointment: (id: string) => void
}

const AppointmentContext = createContext<AppointmentContextValue | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as Appointment[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  }, [appointments])

  const addAppointment = useCallback(
    (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
      const nextAppointment: Appointment = {
        ...appointment,
        id: crypto.randomUUID(),
        status: 'Kutilmoqda',
        createdAt: new Date().toISOString(),
      }

      setAppointments((current) => [nextAppointment, ...current])
    },
    [],
  )

  const removeAppointment = useCallback((id: string) => {
    setAppointments((current) => current.filter((appointment) => appointment.id !== id))
  }, [])

  const value = useMemo(
    () => ({ appointments, addAppointment, removeAppointment }),
    [addAppointment, appointments, removeAppointment],
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
