'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// The pill search field at the start of every list toolbar
export function DataTableSearch({ value, onChange, placeholder, label, className }) {
  return (
    <label
      className={cn(
        'flex h-11 w-full items-center gap-2.5 rounded-full border border-input bg-card px-4 text-muted-foreground focus-within:ring-2 focus-within:ring-ring sm:w-[280px]',
        className
      )}>
      <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <input
        type="search"
        aria-label={label || placeholder}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-faint sm:text-[15px]"
      />
    </label>
  )
}
