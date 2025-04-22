'use client'

import { formatCurrency } from '@/utils/format'
import { ChangeEvent, useEffect, useState } from 'react'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  id?: string
  name?: string
  required?: boolean
  className?: string
  placeholder?: string
  min?: number
  max?: number
}

export default function CurrencyInput({
  value,
  onChange,
  id,
  name,
  required,
  className = '',
  placeholder,
  min = 0,
  max,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    // Khi giá trị thay đổi từ bên ngoài, cập nhật displayValue
    setDisplayValue(value ? formatNumber(value) : '')
  }, [value])

  const formatNumber = (num: number): string => {
    return num.toLocaleString('vi-VN')
  }

  const parseNumber = (str: string): number => {
    // Loại bỏ tất cả ký tự không phải số
    const numStr = str.replace(/[^0-9]/g, '')
    return parseInt(numStr, 10) || 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const parsedValue = parseNumber(inputValue)
    
    if (min !== undefined && parsedValue < min) {
      return
    }

    if (max !== undefined && parsedValue > max) {
      return
    }

    setDisplayValue(inputValue)
    onChange(parsedValue)
  }

  const handleBlur = () => {
    // Khi blur, format lại số theo định dạng tiền tệ
    if (value) {
      setDisplayValue(formatNumber(value))
    }
  }

  const handleFocus = () => {
    // Khi focus, hiển thị số không có định dạng
    if (value) {
      setDisplayValue(value.toString())
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        required={required}
        className={`${className} pr-12`} // Thêm padding bên phải cho đơn vị tiền tệ
        placeholder={placeholder}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        ₫
      </span>
    </div>
  )
}