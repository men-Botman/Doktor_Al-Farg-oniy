import { motion } from 'framer-motion'
import type { Doctor } from '../types'
import { DoctorCard } from './DoctorCard'

type DoctorGridProps = {
  doctors: Doctor[]
  onBook: (doctor: Doctor) => void
}

export function DoctorGrid({ doctors, onBook }: DoctorGridProps) {
  return (
    <motion.div
      layout
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
    >
      {doctors.map((doctor) => (
        <motion.div
          key={doctor.id}
          layout
          variants={{
            hidden: { opacity: 0, y: 18, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        >
          <DoctorCard doctor={doctor} onBook={onBook} />
        </motion.div>
      ))}
    </motion.div>
  )
}
