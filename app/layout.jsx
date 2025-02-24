import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(inter.className, 'h-[calc(100vh-64px)]')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
