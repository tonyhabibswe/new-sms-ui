'use client'

import { LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const initialsOf = (name) => (name || '?').slice(0, 2).toUpperCase()

// Who is signed in, the theme, and sign out. Opened from the sidebar on desktop
// and from the Account tab on phones.
export function AccountMenu({ children, side = 'top', align = 'end' }) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    // Use replace instead of push to prevent back button navigation
    router.replace('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} className="w-64">
        <div className="flex flex-col gap-0.5 px-3 py-2">
          <span className="text-sm font-semibold text-foreground">
            {session?.user?.username}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {session?.user?.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="gap-2.5">
            <Sun className="h-4 w-4" aria-hidden="true" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2.5">
            <Moon className="h-4 w-4" aria-hidden="true" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2.5">
            <Monitor className="h-4 w-4" aria-hidden="true" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
