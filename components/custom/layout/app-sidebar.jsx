'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Ellipsis } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandMark } from './brand-mark'
import { AccountMenu, initialsOf } from './account-menu'
import { NAV_ITEMS, isActive } from './nav-items'

// Desktop navigation; phones use MobileTabBar
export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const username = session?.user?.username

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-8 border-r border-border bg-card px-4 py-6 lg:flex">
      <BrandMark />
      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-11 items-center gap-3 rounded-full border px-3.5 text-[15px] transition-colors',
                active
                  ? 'border-brand-400/30 bg-brand-400/5 font-semibold text-primary'
                  : 'border-transparent font-medium text-muted-foreground hover:bg-accent hover:text-foreground'
              )}>
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto flex items-center gap-3 rounded-card-sm border border-border bg-background py-2.5 pl-3 pr-2.5">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card font-display text-sm font-bold">
          {initialsOf(username)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">{username}</span>
          <span className="truncate text-xs text-faint">
            {session?.user?.email}
          </span>
        </span>
        <AccountMenu side="top" align="end">
          <button
            type="button"
            aria-label="Account menu"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Ellipsis className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </AccountMenu>
      </div>
    </aside>
  )
}
