import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import ReduxProvider from 'src/store/ReduxProvider'
import { HydrationWrapper } from '@components/HydrationWrapper/HydrationWrapper'
import InitialDataLoader from '@components/InitialDataLoader/InitialDataLoader'

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
          <InitialDataLoader />
          <HydrationWrapper>{children}</HydrationWrapper>
        </ReduxProvider>
      </body>
    </html>
  )
}
