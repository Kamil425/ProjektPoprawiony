"use client"
import './globals.css'
import { Poppins } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
    <html lang="en" className='h-full w-full'>
      <body className={poppins.className} >{children}</body>
    </html>
    </SessionProvider>
  )
}
