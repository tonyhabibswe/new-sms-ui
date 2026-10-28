import { Skeleton } from '@/components/ui/skeleton'

// A page while its data loads: the header, then a card of rows
export function PageSkeleton({ rows = 6 }) {
  return (
    <div className="flex flex-col gap-6 lg:gap-8" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-56 lg:h-12 lg:w-72" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      <div className="flex flex-col gap-4 rounded-card-sm border border-border bg-card p-5 shadow-card sm:rounded-card lg:p-6">
        <Skeleton className="h-11 w-full rounded-full sm:w-[280px]" />
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}
