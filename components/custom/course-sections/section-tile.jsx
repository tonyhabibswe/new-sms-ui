import * as React from 'react'
import Link from 'next/link'

const tileClass =
  'flex flex-col gap-3 rounded-card-sm border border-border bg-card p-4 text-left text-foreground shadow-card transition-colors hover:bg-muted sm:p-5'

// A quick action on the course-section overview: icon, label and a caption
export const SectionTile = React.forwardRef(
  ({ as = 'link', href, icon: Icon, label, caption, ...props }, ref) => {
    const content = (
      <>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-[15px] font-bold leading-5">{label}</span>
          {caption && (
            <span className="text-[13px] leading-[18px] text-muted-foreground">{caption}</span>
          )}
        </span>
      </>
    )
    if (as === 'button') {
      return (
        <button ref={ref} type="button" className={tileClass} {...props}>
          {content}
        </button>
      )
    }
    return (
      <Link ref={ref} href={href} className={tileClass} {...props}>
        {content}
      </Link>
    )
  }
)
SectionTile.displayName = 'SectionTile'
