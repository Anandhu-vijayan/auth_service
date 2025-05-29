import { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const OTP_LENGTH = 6
const RESEND_INTERVAL = 30 // seconds

export default function OtpInput({ email, onVerify, loading, onResend, resendLoading, verified }) {
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''))
  const inputsRef = useRef([])
  const [timer, setTimer] = useState(RESEND_INTERVAL)

  useEffect(() => {
    if (timer === 0) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Reset timer when resend triggered
  const handleResend = async () => {
    if (timer === 0 && onResend) {
      await onResend()
      setTimer(RESEND_INTERVAL)
      setOtpValues(Array(OTP_LENGTH).fill(''))
      inputsRef.current[0]?.focus()
    }
  }

  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const newOtp = [...otpValues]
    newOtp[idx] = val
    setOtpValues(newOtp)
    if (val && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

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

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length) {
      setOtpValues(pasted.split('').concat(Array(OTP_LENGTH - pasted.length).fill('')))
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
            disabled={verified}
          />
        ))}
      </div>
      <Button
        type="submit"
        className="w-full text-lg py-2.5 flex items-center justify-center"
        disabled={loading || otpValues.some(d => d === '') || verified}
        style={verified ? { backgroundColor: '#16a34a', borderColor: '#16a34a' } : {}}
      >
        {verified ? (
          <>
            <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </>
        ) : loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
      <div className="text-center mt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={timer > 0 || resendLoading || verified}
          onClick={handleResend}
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : resendLoading
              ? 'Resending...'
              : 'Resend OTP'}
        </Button>
      </div>
    </form>
  )
}