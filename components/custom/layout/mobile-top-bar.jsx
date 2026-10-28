'use client'

import { usePathname } from 'next/navigation'
import { BrandMark } from './brand-mark'
import { NAV_ITEMS } from './nav-items'

// The brand shows on the phone's top-level screens; deeper screens start with
// a back link instead (PageHeader)
export function MobileTopBar() {
  const pathname = usePathname()
  if (!NAV_ITEMS.some((item) => item.href === pathname)) return null

  return (
    <div className="flex h-14 items-center px-3 pt-2 lg:hidden">
      <BrandMark compact />
    </div>
  )
}
