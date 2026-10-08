export type ThemeMode = 'light' | 'dark'
export type LanguageCode = 'uz' | 'ru' | 'en'
export type Language = 'UZ' | 'RU' | 'EN'

export type Specialty =
  | 'Barchasi'
  | 'LOR (Otolaringolog)'
  | 'Stomatolog'
  | 'Kardiolog'
  | 'Nevropatolog'
  | 'Pediatr'
  | 'Oftalmolog'
  | 'Dermatolog'
  | 'Xirurg'

export interface DoctorLocation {
  city: string
  address: string
  distanceKm: number
  coords: {
    lat: number
    lng: number
  }
}

export interface Review {
  id: string
  patientName: string
  rating: number
  comment: string
  verified: boolean
  date: string
}

export interface MedicalRecord {
  id: string
  diagnosis: string
  prescription: string
  date: string
}

export interface Doctor {
  id: string
  name: string
  specialty: Exclude<Specialty, 'Barchasi'>
  title: string
  rating: number
  experience: number
  fee: number
  location: DoctorLocation
  clinic: string
  image: string
  bio: string
  availableDates: string[]
  slots: string[]
  availableToday: boolean
  workSchedule: string[]
  reviews: Review[]
  medicalRecords: MedicalRecord[]
}

export interface FilterState {
  selectedSpecialty: Specialty
  searchTerm: string
  minPrice: number
  maxPrice: number
  minRating: number
  availabilityToday: boolean
}

export interface Slot {
  id: string
  time: string
  available: boolean
}

export type AppointmentStatus = 'Kutilmoqda' | 'Tasdiqlandi' | 'Yakunlandi' | 'Bekor qilindi'

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
  notes?: string
  telegramEnabled?: boolean
  telegramHandle?: string
  confirmationCode?: string
  finalFee?: number
  promoCode?: string
  videoLink?: string
}

export interface ReviewSubmission {
  patientName: string
  rating: number
  comment: string
}

export interface BookingPayload {
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
  promoCode?: string
  finalFee?: number
}
