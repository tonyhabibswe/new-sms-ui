import ThemeToggle from './theme-toggle'
import { UserNav } from './user-nav'

export function Menu() {
  return (
    <div className="rounded-none border-b px-2 lg:px-4 fixed top-0 right-0 left-0 z-20 bg-background">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-2xl font-semibold lg:ml-12">SMS</h1>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  )
}
