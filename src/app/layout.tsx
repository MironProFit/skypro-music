import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import ReduxProvider from 'src/store/ReduxProvider'
import { HydrationWrapper } from '@components/HydrationWrapper/HydrationWrapper'
import InitialDataLoader from '@components/InitialDataLoader/InitialDataLoader'
import { ToastProvider } from '@components/ToastProvider/ToastProvider'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['cyrillic'],
})

export const metadata: Metadata = {
  title: 'Music App',
  description: 'Your music streaming platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <ReduxProvider>
          <ToastProvider>
            <InitialDataLoader />
            <HydrationWrapper>{children}</HydrationWrapper>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
