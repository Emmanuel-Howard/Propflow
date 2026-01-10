import type { Metadata } from 'next'
import { Inter, Playfair_Display, Lora } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'Propflow - Email Marketing for Real Estate',
  description:
    'Professional email marketing platform for real estate agents, mortgage brokers, and developers.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} ${lora.variable} font-sans antialiased`}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
