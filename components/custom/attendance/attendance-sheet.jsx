'use client'

import { useMemo, useState } from 'react'
import { Check, CircleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import useFetchApi from '@/hooks/useFetchApi'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { DataTableSearch } from '../data-table/data-table-search'

// Set elsewhere and shown read-only; the API spells absent "abscent"
const SPECIAL = { dismissed: 'Dismissed', exam: 'Exam', holiday: 'Holiday' }

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'present', label: 'Present' },
  { value: 'abscent', label: 'Absent' },
  { value: 'unmarked', label: 'Not marked' }
]

const fullName = (student) => `${student.firstName} ${student.lastName}`
const initials = (student) => `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`

function StatusToggle({ student, status, onChange }) {
  const name = fullName(student)
  return (
    <div
      role="group"
      aria-label={`Attendance for ${name}`}
      className={cn(
        'inline-flex shrink-0 gap-0.5 rounded-full border p-0.5',
        status ? 'border-border bg-muted' : 'border-dashed border-input bg-card'
      )}>
      <button
        type="button"
        aria-pressed={status === 'present'}
        onClick={() => onChange('present')}
        className={cn(
          'inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors md:px-4',
          status === 'present'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}>
        {status === 'present' && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
        Present
      </button>
      <button
        type="button"
        aria-pressed={status === 'abscent'}
        onClick={() => onChange('abscent')}
        className={cn(
          'inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors md:px-4',
          status === 'abscent'
            ? 'bg-absent-solid text-white'
            : 'text-muted-foreground hover:text-foreground'
        )}>
        {status === 'abscent' && <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
        Absent
      </button>
    </div>
  )
}

function SaveStatus({ state }) {
  if (state === 'saving') {
    return <span className="text-[13px] text-faint">Saving…</span>
  }
  if (state === 'error') {
    return (
      <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-destructive">
        <CircleAlert className="h-4 w-4" aria-hidden="true" />
        A change wasn&apos;t saved. Try again.
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-faint">
      <Check className="h-4 w-4" aria-hidden="true" />
      Saved as you mark it
    </span>
  )
}

export function AttendanceSheet({ sessionId, students }) {
  const { fetchData } = useFetchApi()
  const { toast } = useToast()
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(students.map((student) => [student.id, student.attendance ?? null]))
  )
  const [selected, setSelected] = useState(() => new Set())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [saveState, setSaveState] = useState('saved')

  const roster = useMemo(
    () =>
      [...students].sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
      ),
    [students]
  )
  const markable = roster.filter((student) => !SPECIAL[statuses[student.id]])
  const present = markable.filter((student) => statuses[student.id] === 'present').length
  const absent = markable.filter((student) => statuses[student.id] === 'abscent').length
  const unmarked = markable.length - present - absent
  const rate = markable.length ? Math.round((present / markable.length) * 100) : 0

  const needle = query.trim().toLowerCase()
  const visible = roster.filter((student) => {
    const status = statuses[student.id]
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unmarked' ? !status : status === filter)
    const matchesQuery =
      !needle ||
      `${fullName(student)} ${student.studentId}`.toLowerCase().includes(needle)
    return matchesFilter && matchesQuery
  })
  const selectable = visible.filter((student) => !SPECIAL[statuses[student.id]])
  const allSelected = selectable.length > 0 && selectable.every((s) => selected.has(s.id))

  // Optimistic: show the change at once, put it back if the API refuses it
  const save = async (ids, value) => {
    const previous = Object.fromEntries(ids.map((id) => [id, statuses[id]]))
    setStatuses((current) => ({ ...current, ...Object.fromEntries(ids.map((id) => [id, value])) }))
    setSaveState('saving')
    try {
      if (ids.length === 1) {
        await fetchData(`/attendance/${ids[0]}`, {
          method: 'PUT',
          body: JSON.stringify({ attendance: value }),
          cache: 'no-store'
        })
      } else {
        await fetchData(`/course-session/${sessionId}/attendances/bulk`, {
          method: 'PUT',
          body: JSON.stringify({ attendanceIds: ids, attendance: value }),
          cache: 'no-store'
        })
        toast({ variant: 'success', title: 'Attendance updated!' })
      }
      setSaveState('saved')
      return true
    } catch (exception) {
      console.error(exception)
      setStatuses((current) => ({ ...current, ...previous }))
      setSaveState('error')
      toast({ variant: 'destructive', title: 'Unable to update attendance' })
      return false
    }
  }

  const markEveryonePresent = () => {
    const ids = markable
      .filter((student) => statuses[student.id] !== 'present')
      .map((student) => student.id)
    if (ids.length) save(ids, 'present')
  }

  const applyToSelection = async (value) => {
    if (await save([...selected], value)) setSelected(new Set())
  }

  const toggleSelected = (id) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(selectable.map((student) => student.id)))

  const stat = 'flex flex-col gap-2 rounded-card-sm border border-border bg-card p-5 shadow-card sm:rounded-card sm:p-6'
  const statLabel = 'flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.2px] text-faint'

  return (
    <div className="flex flex-col gap-4 pb-16 md:gap-6 md:pb-0">
      {/* Summary: three cards on desktop, one compact card on phones */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        <div className={stat}>
          <span className={statLabel}>
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            Present
          </span>
          <span className="font-display text-2xl font-bold leading-8">
            {present}{' '}
            <span className="font-sans text-[15px] font-medium text-muted-foreground">
              of {markable.length} students
            </span>
          </span>
        </div>
        <div className={stat}>
          <span className={statLabel}>
            <span className="h-2 w-2 rounded-full bg-absent-solid" aria-hidden="true" />
            Absent
          </span>
          <span className="font-display text-2xl font-bold leading-8">
            {absent}{' '}
            <span className="font-sans text-[15px] font-medium text-muted-foreground">
              {unmarked > 0 ? `· ${unmarked} not marked` : 'students'}
            </span>
          </span>
        </div>
        <div className={stat}>
          <span className={statLabel}>Attendance rate</span>
          <span className="font-display text-2xl font-bold leading-8">{rate}%</span>
          <div className="h-1.5 overflow-hidden rounded-full bg-accent" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${rate}%` }} />
          </div>
        </div>
      </div>

      <section
        aria-label="Summary"
        className="flex flex-col gap-3.5 rounded-card-sm border border-border bg-card p-4 shadow-card md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Present', value: present, dot: 'bg-primary' },
            { label: 'Absent', value: absent, dot: 'bg-absent-solid' },
            { label: 'Not marked', value: unmarked, dot: 'border-2 border-input' }
          ].map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="font-display text-[22px] font-bold leading-7">{item.value}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn('h-2 w-2 rounded-full', item.dot)} aria-hidden="true" />
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-accent" aria-hidden="true">
          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${rate}%` }} />
        </div>
        <Button variant="outline" onClick={markEveryonePresent} disabled={unmarked + absent === 0}>
          <Check className="h-[18px] w-[18px]" aria-hidden="true" />
          Mark everyone present
        </Button>
      </section>

      <section
        aria-label="Students"
        className="flex flex-col gap-3 md:gap-0 md:overflow-hidden md:rounded-card md:border md:border-border md:bg-card md:shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 md:px-6 md:py-5">
          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            <DataTableSearch
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students"
            />
            <div className="-mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:rounded-full md:border md:border-border md:bg-card md:p-1 md:px-1">
              {FILTERS.map((option) => {
                const count = {
                  all: roster.length,
                  present,
                  abscent: absent,
                  unmarked
                }[option.value]
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={filter === option.value}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      'h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-colors md:border-0',
                      filter === option.value
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    )}>
                    {option.label} {count}
                  </button>
                )
              })}
            </div>
          </div>
          <Button
            variant="outline"
            className="hidden md:inline-flex"
            onClick={markEveryonePresent}
            disabled={unmarked + absent === 0}>
            <Check className="h-[18px] w-[18px]" aria-hidden="true" />
            Mark everyone present
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="hidden grid-cols-[44px_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-4 border-t border-border px-6 py-3 text-xs font-semibold uppercase tracking-[1.2px] text-faint md:grid">
          <span />
          <span>Student</span>
          <span>Major</span>
          <span className="w-[214px] text-right">Status</span>
        </div>

        <ul className="flex flex-col gap-2 md:gap-0">
          {visible.map((student) => {
            const status = statuses[student.id]
            const special = SPECIAL[status]
            const isSelected = selected.has(student.id)
            return (
              <li
                key={student.id}
                className={cn(
                  'flex items-center gap-3 rounded-[18px] border border-border p-2.5 pl-3 md:grid md:grid-cols-[44px_minmax(0,2fr)_minmax(0,1fr)_auto] md:gap-4 md:rounded-none md:border-0 md:border-t md:px-6 md:py-2.5',
                  isSelected ? 'bg-brand-400/5' : 'bg-card'
                )}>
                <label className="relative hidden h-11 w-11 cursor-pointer items-center justify-center md:flex">
                  <input
                    type="checkbox"
                    className="peer absolute h-px w-px opacity-0"
                    checked={isSelected}
                    disabled={Boolean(special)}
                    onChange={() => toggleSelected(student.id)}
                    aria-label={`Select ${fullName(student)}`}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-[6px] border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:opacity-40',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-card'
                    )}>
                    {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </label>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-display text-[13px] font-bold md:h-10 md:w-10 md:text-sm">
                    {initials(student)}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[15px] font-semibold leading-5">
                      {fullName(student)}
                    </span>
                    <span className="text-xs leading-4 text-muted-foreground md:text-[13px] md:leading-[18px]">
                      {student.studentId}
                    </span>
                  </span>
                </div>
                <span className="hidden truncate text-sm text-muted-foreground md:block">
                  {student.major}
                </span>
                <div className="flex justify-end">
                  {special ? (
                    <span className="inline-flex h-11 items-center rounded-full border border-border bg-muted px-4 text-[13px] font-semibold text-muted-foreground">
                      {special}
                    </span>
                  ) : (
                    <StatusToggle
                      student={student}
                      status={status}
                      onChange={(value) => status !== value && save([student.id], value)}
                    />
                  )}
                </div>
              </li>
            )
          })}
          {visible.length === 0 && (
            <li className="rounded-card-sm border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground md:rounded-none md:border-0 md:border-t md:border-solid md:border-border">
              No students match.
            </li>
          )}
        </ul>

        <div className="hidden flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4 md:flex">
          <div className="flex items-center gap-4">
            <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--primary))]"
                checked={allSelected}
                onChange={toggleAll}
              />
              Select all
            </label>
            <SaveStatus state={saveState} />
          </div>
          {selected.size > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground py-1.5 pl-4 pr-1.5 text-background shadow-card">
              <span className="text-sm font-semibold">{selected.size} selected</span>
              <button
                type="button"
                onClick={() => applyToSelection('present')}
                className="h-9 rounded-full bg-background px-3.5 text-[13px] font-semibold text-foreground">
                Set present
              </button>
              <button
                type="button"
                onClick={() => applyToSelection('abscent')}
                className="h-9 rounded-full bg-background px-3.5 text-[13px] font-semibold text-foreground">
                Set absent
              </button>
              <button
                type="button"
                aria-label="Clear selection"
                onClick={() => setSelected(new Set())}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-muted-foreground/60 text-background">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Phones: no tab bar on this screen, so its save state sits at the bottom */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-center border-t border-border bg-card px-5 pb-[env(safe-area-inset-bottom)] md:hidden">
        <SaveStatus state={saveState} />
      </div>
    </div>
  )
}
