'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => {
    router.replace(isAuthenticated ? '/image-edit' : '/login')
  }, [isAuthenticated, router])
  return null
}
