'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronRight, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { semesterLinks } from '@/lib/semesters'
import { DataTableSearch } from '@/components/custom/data-table/data-table-search'
import { SemesterStatusChip } from './status-chip'
import { SemesterActions } from './semester-actions'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ended', label: 'Ended' }
]

const holidaysLabel = (count) =>
  count === 0 ? 'No holidays' : `${count} ${count === 1 ? 'holiday' : 'holidays'}`

const pillLink =
  'inline-flex h-9 items-center rounded-full border border-border bg-muted px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent'

function CurrentSemester({ semester, sectionCount }) {
  const links = semesterLinks(semester)
  const stats = [
    { label: 'Course sections', value: sectionCount, href: links.sections },
    { label: 'Holidays', value: semester.holidayCount, href: links.holidays }
  ]
  return (
    <section
      aria-labelledby="current-semester"
      className="flex flex-wrap items-center justify-between gap-6 rounded-card-sm border border-brand-400/30 bg-card p-5 shadow-hero sm:rounded-panel sm:p-8">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <SemesterStatusChip status={semester.status} />
          <span className="text-[13px] text-faint sm:hidden">
            Week {semester.week} of {semester.weeks}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h2
            id="current-semester"
            className="font-display text-2xl font-bold leading-[30px] sm:text-[32px] sm:leading-10">
            {semester.name}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {semester.range}
            <span className="hidden sm:inline">
              {' '}
              · Week {semester.week} of {semester.weeks}
            </span>
          </p>
        </div>
        <div className="flex max-w-[520px] flex-col gap-2">
          <div
            role="progressbar"
            aria-label={`${semester.name} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={semester.progress}
            className="h-2 overflow-hidden rounded-full bg-accent">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${semester.progress}%` }}
            />
          </div>
          <p className="text-[13px] text-faint">{semester.progress}% of the term is done</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex min-w-0 flex-col gap-1 rounded-card-sm border border-border bg-muted px-4 py-3.5 transition-colors hover:bg-accent sm:min-w-[160px] sm:px-6 sm:py-5">
            <span className="font-display text-xl font-bold leading-[26px] sm:text-2xl sm:leading-8">
              {stat.value ?? '–'}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-primary sm:text-sm">
              {stat.label}
              <ChevronRight className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function SemesterCard({ semester }) {
  const links = semesterLinks(semester)
  return (
    <article className="flex flex-col gap-5 rounded-card-sm border border-border bg-card p-5 shadow-card sm:rounded-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <SemesterStatusChip status={semester.status} />
        <SemesterActions semester={semester} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[22px] font-bold leading-7">
          <Link href={links.sections} className="hover:text-primary">
            {semester.name}
          </Link>
        </h3>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          {semester.range}
        </p>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />
          {holidaysLabel(semester.holidayCount)}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
        <Link href={links.sections} className={pillLink}>
          Course sections
        </Link>
        <Link href={links.holidays} className={pillLink}>
          Holidays
        </Link>
      </div>
    </article>
  )
}

export function SemestersOverview({ semesters, current, currentSectionCount }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const others = semesters.filter((semester) => semester.id !== current?.id)
  const shown = others.filter(
    (semester) =>
      (filter === 'all' || semester.status === filter) &&
      semester.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <>
      {current && (
        <CurrentSemester semester={current} sectionCount={currentSectionCount} />
      )}
      <section aria-labelledby="semester-list" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="semester-list" className="font-display text-[22px] font-bold leading-7">
            {current ? 'Other semesters' : 'All semesters'}
          </h2>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <DataTableSearch
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search semesters"
            />
            <div className="flex gap-1 rounded-full border border-border bg-card p-1">
              {FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    'h-9 rounded-full px-4 text-sm font-semibold transition-colors',
                    filter === option.value
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {shown.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {shown.map((semester) => (
              <SemesterCard key={semester.id} semester={semester} />
            ))}
          </div>
        ) : (
          <p className="rounded-card-sm border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
            {others.length > 0
              ? 'No semesters match.'
              : current
                ? 'No other semesters yet.'
                : 'No semesters yet. Create one to start planning.'}
          </p>
        )}
      </section>
    </>
  )
}
