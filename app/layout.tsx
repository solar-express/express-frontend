import type React from "react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "@/context/CartContext"
import AnalyticsProvider from "@/components/analytics-provider"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { ToastProvider } from "@/components/ui/toast"
import { QueryProvider } from "@/providers/QueryProvider"
import { ErrorBoundary } from '@/components/error-boundary'
// import { Analytics } from '@vercel/analytics/next'
import { OrganizationSchema } from '@/components/structured-data'
import { WebSiteSchema } from '@/components/structured-data'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})


export const metadata = {
  metadataBase: new URL('https://www.solarexpress.pk'),
  title: {
    default: 'Solar Express - Premium Solar & Renewable Energy Products in Pakistan',
    template: '%s | Solar Express'
  },
  description: 'Leading supplier of solar panels, inverters, batteries, and renewable energy solutions in Pakistan. Best prices, top brands, expert installation. Shop now!',
  keywords: ['solar panels Pakistan', 'solar inverters', 'solar batteries', 'renewable energy', 'solar products', 'solar installation', 'solar energy Pakistan', 'solar power systems'],
  authors: [{ name: 'Solar Express' }],
  creator: 'Solar Express',
  publisher: 'Solar Express',
  generator: 'skordl',
  applicationName: 'Solar Express',
  referrer: 'origin-when-cross-origin',
  category: 'Solar Energy & Renewable Products',
  verification: {
    google: 'googlec35bf1053eea3bc0'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.solarexpress.pk',
    siteName: 'Solar Express',
    title: 'Solar Express - Premium Solar & Renewable Energy Products',
    description: 'Leading supplier of solar panels, inverters, batteries, and renewable energy solutions in Pakistan. Best prices, top brands, expert installation.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Solar Express - Solar Energy Products',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Express - Solar Energy Products Pakistan',
    description: 'Leading supplier of solar panels, inverters, batteries in Pakistan. Best prices, top brands.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Preload a fallback OG image to improve social preview LCP */}
        <link rel="preload" as="image" href="/og-image.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Gulzar&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <OrganizationSchema />
        <WebSiteSchema />
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <AnalyticsProvider>
                    <Toaster position="top-center" />
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    {/* <Analytics /> */}
                    {/* <Analytics /> */}
                    <Footer />
                    <FloatingCartButton />
                  </AnalyticsProvider>
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
