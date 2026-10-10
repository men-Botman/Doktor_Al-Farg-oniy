import { AnimatePresence, motion } from 'framer-motion'
import { HeartPulse } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

type PreloaderProps = {
  loading: boolean
}

export function Preloader({ loading }: PreloaderProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${
            isDark ? 'bg-slate-900' : 'bg-slate-50'
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.22),transparent_52%)]'
                : 'bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15),transparent_52%)]'
            }`}
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex flex-col items-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                boxShadow: [
                  isDark ? '0 0 0 rgba(34,211,238,0)' : '0 0 0 rgba(59,130,246,0)',
                  isDark ? '0 0 30px rgba(34,211,238,0.25)' : '0 0 30px rgba(59,130,246,0.24)',
                  isDark ? '0 0 0 rgba(34,211,238,0)' : '0 0 0 rgba(59,130,246,0)',
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] border shadow-2xl ${
                isDark
                  ? 'border-cyan-400/30 bg-slate-800/80 text-cyan-300'
                  : 'border-blue-200 bg-white text-blue-600'
              }`}
            >
              <HeartPulse className="h-9 w-9" strokeWidth={2.2} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className={`text-4xl font-black tracking-tight md:text-5xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              AuraHealth
            </motion.h1>

            <p
              className={`mt-3 text-xs font-medium uppercase tracking-[0.28em] ${
                isDark ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              Care starts here
            </p>

            <div
              className={`mt-7 h-2.5 w-64 overflow-hidden rounded-full ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
              />
            </div>

            <p
              className={`mt-5 animate-pulse text-sm font-medium ${
                isDark ? 'text-cyan-300' : 'text-blue-600'
              }`}
            >
              Loading...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
