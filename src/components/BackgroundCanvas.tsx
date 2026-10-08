import { useEffect, useRef } from 'react'
import type { ThemeMode } from '../types'

type BackgroundCanvasProps = {
  specialty?: string
  theme?: ThemeMode
}

type Particle = {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  color: string
}

export function BackgroundCanvas({ specialty = 'default', theme = 'dark' }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const basePalette: Record<string, string[]> = {
      default: ['#06B6D4', '#10B981', '#8B5CF6'],
      'LOR (Otolaringolog)': ['#22d3ee', '#67e8f9', '#8b5cf6'],
      Stomatolog: ['#2dd4bf', '#22c55e', '#60a5fa'],
      Kardiolog: ['#f472b6', '#fb7185', '#38bdf8'],
      Nevropatolog: ['#a78bfa', '#60a5fa', '#facc15'],
      Pediatr: ['#34d399', '#10b981', '#2dd4bf'],
      Oftalmolog: ['#38bdf8', '#7dd3fc', '#a78bfa'],
      Dermatolog: ['#f472b6', '#fb7185', '#e879f9'],
      Xirurg: ['#f59e0b', '#22d3ee', '#60a5fa'],
    }

    const palette = theme === 'dark' ? basePalette : {
      ...basePalette,
      default: ['#60a5fa', '#2dd4bf', '#93c5fd'],
    }

    const colors = palette[specialty] ?? palette.default
    const particles: Particle[] = Array.from({ length: 72 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.6 + 0.8,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      alpha: Math.random() * 0.7 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    let animationFrame = 0
    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2

    const handlePointerMove = (event: MouseEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
    }

    const resize = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth * window.devicePixelRatio
      canvas.height = innerHeight * window.devicePixelRatio
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      particles.forEach((particle) => {
        const dx = pointerX - particle.x
        const dy = pointerY - particle.y
        const distance = Math.hypot(dx, dy) || 1
        const force = Math.min(distance, 160) / 160

        particle.x += particle.vx + (dx / distance) * 0.18 * force
        particle.y += particle.vy + (dy / distance) * 0.18 * force

        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1

        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 8,
        )
        gradient.addColorStop(0, particle.color + 'cc')
        gradient.addColorStop(1, particle.color + '00')

        context.beginPath()
        context.fillStyle = gradient
        context.globalAlpha = particle.alpha
        context.arc(particle.x, particle.y, particle.radius * 8, 0, Math.PI * 2)
        context.fill()
        context.globalAlpha = 1
      })

      animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handlePointerMove)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handlePointerMove)
    }
  }, [specialty, theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: theme === 'dark' ? 0.72 : 0.38 }}
    />
  )
}
