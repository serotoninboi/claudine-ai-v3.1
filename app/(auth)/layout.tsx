'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => { if (isAuthenticated) router.replace('/image-edit') }, [isAuthenticated, router])
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
