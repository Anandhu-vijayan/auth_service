'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema } from '@/lib/validation/authSchema'
import OtpInput from '@/components/auth-form/otpInput'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/utils/api'

export default function AuthForm({ type = 'login' }) {
  const isRegister = type === 'register'
  const isForgot = type === 'forgot'
  const [showOtpField, setShowOtpField] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(authSchema),
  })

  const handleVerifyOtp = async (otp) => {
    setOtpLoading(true)
    try {
      await api.post('/auth/verify-otp', { email: registeredEmail, otp })
      toast.success('OTP Verified!')
      // Redirect or log in the user here
    } catch (err) {
      toast.error(err?.response?.data?.message || 'OTP verification failed')
    }
    setOtpLoading(false)
  }

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (isRegister) {
        return await api.post('/auth/register', formData)
      }
      if (isForgot) {
        return await api.post('/api/auth/forgot-password', formData)
      }
      return await api.post('/api/auth/login', formData)
    },
    onSuccess: (res) => {
      toast.success('Success')
      if (isRegister) {
        setShowOtpField(true)
        setRegisteredEmail(res.data.data.email)
      }
      // other success logic for login/forgot
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || 'Something went wrong')
      setError('root.serverError', { type: 'server', message })
    },
  })

  const onFormSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {errors.root?.serverError && (
        <div className="mb-4 rounded bg-red-100 border border-red-400 px-4 py-2 text-red-700 text-center">
          {errors.root.serverError.message}
        </div>
      )}
      {showOtpField ? (
        <OtpInput
          email={registeredEmail}
          onVerify={handleVerifyOtp}
          loading={otpLoading}
        />
      ) : (
        <Card className="w-full max-w-lg shadow-2xl p-8 rounded-2xl">
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {isRegister && (
                <div>
                  <Input placeholder="Full Name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                </div>
              )}

              <div>
                <Input type="email" placeholder="Email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              {!isForgot && (
                <div>
                  <Input type="password" placeholder="Password" {...register('password')} />
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                </div>
              )}

              {isRegister && (
                <div>
                  <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
                </div>
              )}

              <Button type="submit" className="w-full text-lg py-2.5" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : isRegister ? 'Register' : isForgot ? 'Send Reset Link' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
              {type === 'login' && (
                <>
                  <p>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline">
                      Sign up
                    </Link>
                  </p>
                  <p>
                    <Link href="/forgot-password" className="text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </p>
                </>
              )}
              {type === 'register' && (
                <p>
                  Have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}