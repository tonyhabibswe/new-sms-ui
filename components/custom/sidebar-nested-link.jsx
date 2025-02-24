'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SidebarNestedLink = ({ name, to, icon }) => {
  const pathname = usePathname()
  return (
    <Link
      href={to}
      className={cn(
        'flex mt-2 items-center py-2 hover:bg-muted rounded-lg',
        pathname === to ? 'bg-muted' : '',
        icon ? 'pl-6' : 'pl-12'
      )}>
      {icon}
      <span className="mx-3">{name}</span>
    </Link>
  )
}

export default SidebarNestedLink
