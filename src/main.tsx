import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppointmentProvider } from './context/AppointmentContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AppointmentProvider>
          <App />
        </AppointmentProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
