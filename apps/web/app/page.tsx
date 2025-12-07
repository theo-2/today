"use client"

import React, { useEffect, useRef, useState } from "react"

const GRID = 7
const CELL = 4
const GAP = 1

type Square = {
  id: number
  row: number
  col: number
  color: string
  visible: boolean
  direction: string
}

type ViewMode = 'time' | 'percent' | 'days'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function paletteForGroups(k: number) {
  const base = [
    "#2c9aff",
    "#8bd17f", 
    "#ffb86b",
    "#9b7bff",
    "#4fd1c5",
    "#ff8fb8",
    "#ffd36b",
    "#7ec0ff",
    "#c48cff",
    "#7ee1a6",
  ]
  const arr = base.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, k)
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [currentView, setCurrentView] = useState<'login' | 'add'>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Add page state
  const [currentTime, setCurrentTime] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('time')
  
  const [squares, setSquares] = useState<Square[]>(() => {
    const out: Square[] = []
    let idx = 0
    const directions = [
      'translateY(-8px)',
      'translateY(8px)',
      'translateX(-8px)',
      'translateX(8px)',
      'translate(-6px, -6px)',
      'translate(6px, 6px)',
      'translate(-6px, 6px)',
      'translate(6px, -6px)'
    ]
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        out.push({ 
          id: idx, 
          row: r, 
          col: c, 
          color: "#e6eef8", 
          visible: false,
          direction: directions[idx % directions.length]
        })
        idx++
      }
    }
    return out
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!(email && password && isValidEmail)) return

    try {
      setLoading(true)
      // simulate network/login delay; replace with real auth later
      await new Promise((r) => setTimeout(r, 5000))
      setCurrentView('add')
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isFormValid = email && password && isValidEmail

  // Time tracking for add page
  useEffect(() => {
    if (currentView === 'add') {
      const updateInterval = viewMode === 'percent' ? 100 : 1000
      const timer = setInterval(() => {
        setCurrentTime(new Date())
      }, updateInterval)

      return () => clearInterval(timer)
    }
  }, [viewMode, currentView])

  // Browser tab title updates for add page
  useEffect(() => {
    if (currentView === 'add') {
      const getTabTitle = () => {
        switch (viewMode) {
          case 'percent':
            return `${getYearPercent(currentTime)}%`
          case 'days':
            const startOfYear = new Date(currentTime.getFullYear(), 0, 1)
            const dayOfYear = Math.ceil((currentTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
            return `${dayOfYear}`
          default:
            const hours12 = currentTime.getHours() % 12 || 12
            const minutes = currentTime.getMinutes().toString().padStart(2, '0')
            const seconds = currentTime.getSeconds().toString().padStart(2, '0')
            const ampm = currentTime.getHours() >= 12 ? 'pm' : 'am'
            return `${hours12}:${minutes}:${seconds} ${ampm}`
        }
      }
      document.title = getTabTitle()
    } else {
      document.title = 'Today'
    }
  }, [currentTime, viewMode, currentView])

  const getYearPercent = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const endOfYear = new Date(date.getFullYear() + 1, 0, 1)
    const yearDuration = endOfYear.getTime() - startOfYear.getTime()
    const elapsed = date.getTime() - startOfYear.getTime()
    const percent = (elapsed / yearDuration) * 100
    return percent.toFixed(7)
  }

  const getDayOfYear = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const dayOfYear = Math.ceil((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    return dayOfYear
  }

  const toggleView = () => {
    setViewMode(prev => prev === 'time' ? 'percent' : prev === 'percent' ? 'days' : 'time')
  }

  // Login page animation
  useEffect(() => {
    if (currentView === 'login') {
      let cancelled = false

      async function runSequence() {
        if (!containerRef.current) return

        const order = squares.map((s) => s.id)
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[order[i], order[j]] = [order[j], order[i]]
        }

        for (let i = 0; i < order.length; i++) {
          if (cancelled) return
          const id = order[i]
          setSquares((prev) => prev.map((p) => (p.id === id ? { ...p, visible: true } : p)))
          await new Promise((r) => setTimeout(r, 5 + Math.random() * 15))
        }

        await new Promise((r) => setTimeout(r, 100))

        // Step 1: Assign colors randomly to all squares
        const k = randInt(3, 10)
        const groupColors = paletteForGroups(k)

        const ids = squares.map((s) => s.id)
        for (let i = ids.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[ids[i], ids[j]] = [ids[j], ids[i]]
        }

        const buckets: number[][] = Array.from({ length: k }, () => [])
        ids.forEach((id, i) => buckets[i % k].push(id))

        // Assign colors first (randomly)
        for (let gi = 0; gi < buckets.length; gi++) {
          const bucket = buckets[gi]
          const color = groupColors[gi % groupColors.length]
          for (const id of bucket) {
            setSquares((prev) => prev.map((p) => (p.id === id ? { ...p, color } : p)))
            await new Promise((r) => setTimeout(r, 8 + Math.random() * 12))
          }
        }

        await new Promise((r) => setTimeout(r, 150))

        // Step 2: Move squares with same colors near each other
        const containerW = GRID * CELL + (GRID - 1) * GAP
        const containerH = containerW
        const centers = buckets.map(() => ({
          x: Math.random() * (containerW * 0.7) + containerW * 0.15,
          y: Math.random() * (containerH * 0.7) + containerH * 0.15,
        }))

        const targetMap = new Map<number, { x: number; y: number }>()
        buckets.forEach((bucket, gi) => {
          const center = centers[gi]
          bucket.forEach((id, idxIn) => {
            const angle = Math.random() * Math.PI * 2
            const radius = 2 + (idxIn % 4) * 3 + Math.random() * 3
            const x = center.x + Math.cos(angle) * radius
            const y = center.y + Math.sin(angle) * radius
            targetMap.set(id, { x, y })
          })
        })

        const movePromises: Promise<void>[] = []
        for (const s of squares) {
          const t = targetMap.get(s.id)
          if (!t) continue
          const col = Math.round(t.x / (CELL + GAP))
          const row = Math.round(t.y / (CELL + GAP))
          movePromises.push(
            new Promise<void>((res) => {
              setTimeout(() => {
                setSquares((prev) => prev.map((p) => (p.id === s.id ? { ...p, row: Math.max(0, Math.min(GRID - 1, row)), col: Math.max(0, Math.min(GRID - 1, col)) } : p)))
                res()
              }, Math.random() * 150)
            })
          )
        }

        await Promise.all(movePromises)

        await new Promise((r) => setTimeout(r, 200))
        setSquares((prev) => prev.map((p) => ({ ...p, color: "#e6eef8" })))

        await new Promise((r) => setTimeout(r, 100))

        const countFinal = randInt(5, 10)
        const allIds = squares.map((s) => s.id)
        for (let i = allIds.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[allIds[i], allIds[j]] = [allIds[j], allIds[i]]
        }
        const picked = allIds.slice(0, countFinal)
        for (const id of picked) {
          setSquares((prev) => prev.map((p) => (p.id === id ? { ...p, color: "#ff7aa2" } : p)))
        }
      }

      runSequence()

      return () => {
        cancelled = true
      }
    }
  }, [currentView])

  const containerSize = GRID * CELL + (GRID - 1) * GAP

  // Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="anim-grid-container" style={{ width: containerSize }}>
            <div className="grid-box" ref={containerRef} style={{ width: containerSize, height: containerSize }}>
              {squares.map((s) => {
                const left = s.col * (CELL + GAP)
                const top = s.row * (CELL + GAP)
                const style: React.CSSProperties = { 
                  left, 
                  top, 
                  backgroundColor: s.color,
                  '--enter-transform': s.direction
                } as React.CSSProperties
                return <div key={s.id} className={`square ${s.visible ? "visible" : ""}`} style={style} aria-hidden />
              })}
            </div>
          </div>
          <div className="text-center -mt-7">
            <span className="text-xs font-bold text-gray-800">Today</span>
          </div>
          
          <div className="mt-6 max-w-44">
            <form onSubmit={handleSubmit} className="space-y-2" noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                disabled={loading}
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                disabled={loading}
              />
              
              <button
                type="submit"
                disabled={!isFormValid || loading}
                aria-busy={loading}
                className={`w-full py-1 px-2 rounded text-xs transition-colors duration-150 flex items-center justify-center ${
                  isFormValid && !loading
                    ? "bg-white text-[#ff7aa2] hover:bg-gray-100 active:bg-gray-200 cursor-pointer shadow-sm"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#ff7aa2] border-t-transparent rounded-full animate-spin" aria-hidden />
                ) : (
                  '→'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Add View
  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={toggleView}
        className="absolute top-4 right-4 px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        {viewMode === 'time' ? '%' : viewMode === 'percent' ? 'D' : 'T'}
      </button>
      
      <div className="text-center">
        <input
          type="text"
          className="px-3 py-2 border-0 outline-none text-sm bg-transparent text-center w-96"
          style={{ 
            caretColor: 'transparent'
          }}
          placeholder=""
          autoFocus
        />
      </div>
    </div>
  )
}
