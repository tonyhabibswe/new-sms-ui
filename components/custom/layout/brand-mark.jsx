import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

// The brand gradient is the one gradient moment on every screen
export function BrandMark({ compact = false, className }) {
  return (
    <Link
      href="/admin/semesters/list"
      className={cn(
        'flex items-center gap-3 rounded-2xl px-2 py-1 text-foreground',
        className
      )}>
      <span
        className={cn(
          'flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-400 to-brand-600 text-white',
          compact ? 'h-9 w-9' : 'h-10 w-10'
        )}>
        <GraduationCap
          className={compact ? 'h-5 w-5' : 'h-[22px] w-[22px]'}
          aria-hidden="true"
        />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-xl font-bold leading-6">SMS</span>
        {!compact && (
          <span className="text-xs leading-4 text-faint">
            Student management
          </span>
        )}
      </span>
    </Link>
  )
}
