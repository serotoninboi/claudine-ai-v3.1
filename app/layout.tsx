import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthContext'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'PixelForge – AI Image Studio',
  description: 'Edit images and poses with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#0a0a0a' }}>
        <AuthProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
