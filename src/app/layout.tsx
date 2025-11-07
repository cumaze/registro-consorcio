import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'registro-consortium-universitas',
  description: 'Sistema de gestión de registros académicos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}