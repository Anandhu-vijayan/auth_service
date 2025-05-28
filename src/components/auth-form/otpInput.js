import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const OTP_LENGTH = 6 // Change this for 4/5/6 digit OTP

export default function OtpInput({ email, onVerify, loading }) {
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef([])

  // Handle change in one input box
  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return // Only digits, allow backspace
    const newOtp = [...otpValues]
    newOtp[idx] = val
    setOtpValues(newOtp)

    // Move to next box if current is filled
    if (val && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  // On backspace, move to previous box if empty
  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
      const prev = inputsRef.current[idx - 1]
      prev.focus()
      setOtpValues((vals) => {
        const copy = [...vals]
        copy[idx - 1] = ''
        return copy
      })
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  // Paste entire OTP
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length) {
      setOtpValues(pasted.split('').concat(Array(OTP_LENGTH - pasted.length).fill('')))
      // Focus last box
      setTimeout(() => {
        inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus()
      }, 0)
    }
    e.preventDefault()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onVerify(otpValues.join(''))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-2 text-gray-700">
        Enter the OTP sent to <span className="font-semibold">{email}</span>
      </div>
      <div className="flex justify-center gap-2 mb-2">
        {otpValues.map((val, idx) => (
          <Input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={e => handleChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            ref={el => inputsRef.current[idx] = el}
            className="w-12 h-12 text-2xl text-center border-2 border-gray-300 rounded focus:border-blue-500 transition-all"
            autoFocus={idx === 0}
          />
        ))}
      </div>
      <Button
        type="submit"
        className="w-full text-lg py-2.5"
        disabled={loading || otpValues.some(d => d === '')}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
    </form>
  )
}