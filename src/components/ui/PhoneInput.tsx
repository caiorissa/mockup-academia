import { forwardRef } from 'react'
import { Input, type InputProps } from './Input'
import { formatPhone } from '@/lib/utils'

interface PhoneInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value: string
  onChange: (value: string) => void
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, ...props }, ref) => (
    <Input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      maxLength={15}
      placeholder="(11) 99999-9999"
      value={value}
      onChange={(e) => onChange(formatPhone(e.target.value))}
      {...props}
    />
  ),
)

PhoneInput.displayName = 'PhoneInput'
