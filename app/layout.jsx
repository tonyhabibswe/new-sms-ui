import '../styles/globals.css'
import { Manrope, Outfit } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

// CodeWithT type: Outfit for headings and figures, Manrope for everything else
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const viewport = {
  // Lets the phone tab bar pad itself clear of the home indicator
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' }
  ]
}

const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(manrope.variable, outfit.variable)}>
      <head />
      <body>
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
