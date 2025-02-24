'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SidebarLink = (props) => {
  const { icon, to, name } = props
  const pathname = usePathname()
  return (
    <div className="mt-3" style={{ marginLeft: '0' }}>
      <Link
        className={cn(
          'flex items-center px-2 py-2 hover:bg-muted rounded-lg',
          pathname === to ? 'bg-muted' : ''
        )}
        href={to}>
        {icon}
        <span className="mx-3">{name}</span>
      </Link>
    </div>
  )
}

export default SidebarLink
