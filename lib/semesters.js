import { format } from 'date-fns'

const DAY = 24 * 60 * 60 * 1000

// API dates are plain YYYY-MM-DD days; read them as local midnight
export const toDay = (value) => new Date(`${value}T00:00:00`)

export const formatRange = (start, end) =>
  start.getFullYear() === end.getFullYear()
    ? `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
    : `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`

/**
 * A semester from the API plus what the screens show about it: status
 * ('upcoming', 'in-progress' or 'ended'), its date range, the current week and
 * how much of the term has passed.
 */
export function describeSemester(semester, now = new Date()) {
  const start = toDay(semester.startDate)
  const end = toDay(semester.endDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const status = today < start ? 'upcoming' : today > end ? 'ended' : 'in-progress'
  const totalDays = Math.round((end - start) / DAY) + 1
  const elapsed = Math.min(Math.max(Math.round((today - start) / DAY) + 1, 0), totalDays)

  return {
    ...semester,
    status,
    range: formatRange(start, end),
    week: status === 'in-progress' ? Math.floor((elapsed - 1) / 7) + 1 : null,
    weeks: Math.ceil(totalDays / 7),
    progress: Math.round((elapsed / totalDays) * 100),
    holidayCount: semester.holidays?.length ?? 0
  }
}

export const semesterLinks = (semester) => ({
  sections: `/admin/semester/${semester.id}/course-sections/list?semester=${encodeURIComponent(semester.name)}`,
  holidays: `/admin/semester/${semester.id}/holidays/list`
})
