'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AccountMenu } from './account-menu'
import { NAV_ITEMS, isActive } from './nav-items'

// Attendance and the gradebook keep their own action bar at the bottom
const hidesTabBar = (pathname) =>
  pathname?.startsWith('/admin/session/') || pathname?.endsWith('/gradebook')

const tabClass =
  'flex flex-col items-center justify-center gap-1 text-[11px] leading-[14px]'
const pillClass = 'flex h-[30px] w-14 items-center justify-center rounded-full border'

export function MobileTabBar() {
  const pathname = usePathname()
  if (hidesTabBar(pathname)) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card px-2 pb-[max(env(safe-area-inset-bottom),12px)] pt-1.5 lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item, pathname)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              tabClass,
              active
                ? 'font-semibold text-primary'
                : 'font-medium text-muted-foreground'
            )}>
            <span
              className={cn(
                pillClass,
                active
                  ? 'border-brand-400/30 bg-brand-400/5'
                  : 'border-transparent'
              )}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {item.name}
          </Link>
        )
      })}
      <AccountMenu side="top" align="end">
        <button
          type="button"
          className={cn(tabClass, 'font-medium text-muted-foreground')}>
          <span className={cn(pillClass, 'border-transparent')}>
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          Account
        </button>
      </AccountMenu>
    </nav>
  )
}
