import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The top of every admin page: breadcrumbs on desktop, a back link to the
 * parent on phones, then eyebrow, title, description and actions.
 *
 * breadcrumbs: [{ label, href }], the last one being the current page.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  actions,
  children,
  className
}) {
  const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null

  return (
    <div className={cn('flex flex-col gap-4 lg:gap-7', className)}>
      {breadcrumbs.length > 1 && (
        <nav aria-label="Breadcrumb" className="hidden lg:block">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1
              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="font-semibold text-foreground">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground transition-colors hover:text-foreground">
                      {crumb.label}
                    </Link>
                  )}
                  {!last && (
                    <ChevronRight className="h-4 w-4 text-faint" aria-hidden="true" />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}
      {parent?.href && (
        <Link
          href={parent.href}
          className="-ml-1 inline-flex h-11 items-center gap-1 self-start pr-2 text-[15px] font-semibold text-primary lg:hidden">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          {parent.label}
        </Link>
      )}
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-0 flex-col gap-2 lg:gap-3">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase leading-4 tracking-eyebrow text-faint lg:text-sm lg:leading-5">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[30px] font-bold leading-9 text-foreground lg:text-[40px] lg:leading-[48px]">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] leading-[22px] text-muted-foreground lg:text-base lg:leading-6">
              {description}
            </p>
          )}
          {children}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </header>
    </div>
  )
}
