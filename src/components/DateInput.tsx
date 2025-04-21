'use client'

import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { vi } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

interface DateInputProps {
  value: number // Ngày trong tháng (1-31)
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
  // Tạo date object với ngày được chọn trong tháng hiện tại
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), value)
  })

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
      onChange(date.getDate())
    }
  }

  return (
    <div className="relative">
      <ReactDatePicker
        id={id}
        name={name}
        selected={selectedDate}
        onChange={handleDateChange}
        locale={vi}
        dateFormat="dd"
        showMonthDropdown={false}
        showYearDropdown={false}
        required={required}
        className={`${className} text-center`}
        placeholderText="Chọn ngày"
        popperPlacement="bottom"
        popperClassName="date-picker-popper"
        customInput={
          <input
            className={`${className} cursor-pointer`}
            placeholder="Chọn ngày"
            readOnly
          />
        }
        renderDayContents={(day) => (
          <div className="w-8 h-8 flex items-center justify-center">
            {day}
          </div>
        )}
      />
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          {label}
        </label>
      )}
    </div>
  )
}