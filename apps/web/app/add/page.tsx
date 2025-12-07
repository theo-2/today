"use client"

import React, { useState, useEffect } from "react"

export default function AddPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [viewMode, setViewMode] = useState<'time' | 'percent' | 'days'>('time')

  useEffect(() => {
    const updateInterval = viewMode === 'percent' ? 100 : 1000 // 100ms for smooth percent, 1s for others
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [viewMode])

  // Update browser tab title with live data
  useEffect(() => {
    const getTabTitle = () => {
      switch (viewMode) {
        case 'percent':
          return `Today: ${getYearPercent(currentTime)}%`
        case 'days':
          const startOfYear = new Date(currentTime.getFullYear(), 0, 1)
          const dayOfYear = Math.ceil((currentTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
          const isLeapYear = (currentTime.getFullYear() % 4 === 0 && currentTime.getFullYear() % 100 !== 0) || (currentTime.getFullYear() % 400 === 0)
          return `Today: ${dayOfYear}`
        default:
          const hours12 = currentTime.getHours() % 12 || 12
          const minutes = currentTime.getMinutes().toString().padStart(2, '0')
          const seconds = currentTime.getSeconds().toString().padStart(2, '0')
          const ampm = currentTime.getHours() >= 12 ? 'pm' : 'am'
          return `Today: ${hours12}:${minutes}:${seconds} ${ampm}`
      }
    }
    document.title = getTabTitle()
  }, [currentTime, viewMode])

  const formatDateTime = (date: Date) => {
    const hours12 = date.getHours() % 12 || 12
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ampm = date.getHours() >= 12 ? 'pm' : 'am'
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    
    return `${hours12.toString().padStart(2, ' ')}:${minutes}:${seconds} ${ampm} ${month} ${day} ${year}`
  }

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

  const getDisplayText = () => {
    switch (viewMode) {
      case 'percent':
        return `${getYearPercent(currentTime)}%`
      case 'days':
        return getDayOfYear(currentTime)
      default:
        const hours12 = currentTime.getHours() % 12 || 12
        const minutes = currentTime.getMinutes().toString().padStart(2, '0')
        const seconds = currentTime.getSeconds().toString().padStart(2, '0')
        const ampm = currentTime.getHours() >= 12 ? 'pm' : 'am'
        
        return (
          <>
            <span style={{ display: 'inline-block', width: '20px', textAlign: 'right' }}>{hours12}</span>
            :<span style={{ display: 'inline-block', width: '18px' }}>{minutes}</span>
            :<span style={{ display: 'inline-block', width: '18px' }}>{seconds}</span>
            {' '}<span style={{ display: 'inline-block', width: '20px' }}>{ampm}</span>
          </>
        )
    }
  }

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
          className="px-3 py-2 border border-gray-200 rounded text-sm bg-white text-gray-900 text-center w-96 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7aa2]"
          style={{
            caretColor: '#ff7aa2'
          }}
          placeholder="Type something..."
          autoFocus
        />
      </div>
    </div>
  )
}