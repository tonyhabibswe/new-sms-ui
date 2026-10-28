import Link from 'next/link'
import { cn } from '@/lib/utils'
import { semesterLinks } from '@/lib/semesters'
import { PageHeader } from '@/components/custom/layout/page-header'
import { SemesterStatusChip } from './status-chip'
import { EditSemesterButton } from './edit-semester-button'

// Header and tabs shared by a semester's course sections and holidays pages
export function SemesterHeader({ semester, active, sectionCount, holidayCount, action }) {
  const links = semesterLinks(semester)
  const tabs = [
    { key: 'sections', label: 'Course sections', count: sectionCount, href: links.sections },
    { key: 'holidays', label: 'Holidays', count: holidayCount, href: links.holidays }
  ]

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <PageHeader
        breadcrumbs={[
          { label: 'Semesters', href: '/admin/semesters/list' },
          { label: semester.name }
        ]}
        eyebrow="Semester"
        title={semester.name}
        actions={
          <>
            <EditSemesterButton semester={semester} />
            {action}
          </>
        }>
        <div className="flex flex-wrap items-center gap-3">
          <SemesterStatusChip status={semester.status} />
          <span className="text-[15px] text-muted-foreground lg:text-base">
            {semester.range}
            {semester.week && ` · Week ${semester.week} of ${semester.weeks}`}
          </span>
        </div>
      </PageHeader>
      <nav
        aria-label={semester.name}
        className="inline-flex gap-1 self-start rounded-full border border-border bg-card p-1">
        {tabs.map((tab) => {
          const current = tab.key === active
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors',
                current ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              )}>
              {tab.label}
              <span
                className={cn(
                  'inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs font-bold',
                  current ? 'bg-background text-foreground' : 'bg-accent text-foreground'
                )}>
                {tab.count ?? '–'}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
