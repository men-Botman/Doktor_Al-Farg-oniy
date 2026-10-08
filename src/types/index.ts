export type Specialty =
  | 'Barchasi'
  | 'LOR (Otolaringolog)'
  | 'Stomatolog'
  | 'Kardiolog'
  | 'Nevropatolog'
  | 'Pediatr'
  | 'Dermatolog'

export interface Doctor {
  id: string
  name: string
  specialty: Exclude<Specialty, 'Barchasi'>
  rating: number
  experience: number
  fee: number
  location: string
  clinic: string
  image: string
  bio: string
  availableDates: string[]
  slots: string[]
}

export interface Slot {
  id: string
  time: string
  available: boolean
}

export type AppointmentStatus = 'Kutilmoqda' | 'Tasdiqlandi'

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  doctorSpecialty: string
  clinic: string
  date: string
  slot: string
  patientName: string
  phone: string
  status: AppointmentStatus
  createdAt: string
}
