

'use client'

import { Calendar } from 'lucide-react'
import styles from './date-picker.module.css'

interface DatePickerProps {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  min?: string
  max?: string
  className?: string
  placeholder?: string
  type?: 'date' | 'month'
  disabled?: boolean
}

export function DatePicker({
  id,
  value,
  onChange,
  required = false,
  min,
  max,
  className = '',
  placeholder,
  type = 'date',
  disabled = false,
}: DatePickerProps) {
  return (
    <div className={`${styles.datePickerWrapper} ${className}`}>
      <Calendar className={styles.calendarIcon} size={18} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.dateInput}
      />
    </div>
  )
}

