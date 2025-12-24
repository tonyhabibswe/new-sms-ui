'use client'

import ThemeToggle from './theme-toggle'
import { UserNav } from './user-nav'
import { Button } from '@/components/ui/button'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

export function Menu({ onMenuClick }) {
  return (
    <div className="rounded-none border-b px-2 lg:px-4 fixed top-0 right-0 left-0 z-20 bg-background">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuClick}>
          <HamburgerMenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-2xl font-semibold lg:ml-12">SMS</h1>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  )
}
