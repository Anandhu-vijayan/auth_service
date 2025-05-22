// components/OtpInput.jsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function OtpInput({ email, onVerify, loading }) {
  const [otp, setOtp] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onVerify(otp)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />
      <Button type="submit" className="w-full" disabled={loading || !otp}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
    </form>
  )
}