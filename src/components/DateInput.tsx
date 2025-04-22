'use client'

import React, { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface DateInputProps {
  value: number
  onChange: (value: number) => void
  id?: string
  name?: string
  required?: boolean
  className?: string
  label?: string
}

export default function DateInput({
  value,
  onChange,
  id,
  name,
  required,
  className = '',
  label
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Tạo ngày trong tháng hiện tại
  const today = new Date()
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()
  
  const currentMonth = format(today, 'MMMM yyyy', { locale: vi })

  // Xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDateClick = (day: number) => {
    onChange(day)
    setIsOpen(false)
  }

  // Tạo grid các ngày trong tháng
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const rows = []
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7))
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={id}
        name={name}
        value={value || ''}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        required={required}
        className={`${className} cursor-pointer text-center`}
        placeholder="Chọn ngày"
      />
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full sm:w-64 mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <div className="text-center font-medium text-gray-900 mb-2">
              {currentMonth}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-500 font-medium p-1"
                >
                  {day}
                </div>
              ))}
              {rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {row.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        w-full aspect-square rounded-full text-sm
                        flex items-center justify-center
                        hover:bg-blue-50
                        ${value === day ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                        ${day === today.getDate() ? 'font-semibold' : ''}
                      `}
                    >
                      {day}
                    </button>
                  ))}
                  {rowIndex === rows.length - 1 && row.length < 7 && 
                    Array(7 - row.length).fill(null).map((_, i) => (
                      <div key={`empty-${i}`} className="w-full aspect-square" />
                    ))
                  }
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}