import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { LetterChip } from '@/components/custom/gradebook/grades-grid'
import { sectionLinks } from '@/lib/section-links'
import { formatRange, toDay } from '@/lib/semesters'

// The API's enrollment statuses; W, UW and I also stand in for the letter grade
const STATUSES = {
  enrolled: { label: 'Enrolled', variant: 'secondary' },
  auditor: { label: 'Auditor', variant: 'default' },
  withdrawn: { label: 'Withdrawn', variant: 'absent' },
  unofficial_withdrawn: { label: 'Unofficial withdrawal', variant: 'absent' },
  incomplete: { label: 'Incomplete', variant: 'outline' }
}

const COLUMNS = 'md:grid-cols-[minmax(0,1fr)_170px_120px_200px]'

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// Courses arrive newest semester first; group them without changing that order
const bySemester = (courses) =>
  courses.reduce((groups, course) => {
    const last = groups[groups.length - 1]
    if (last?.id === course.semesterId) last.courses.push(course)
    else
      groups.push({
        id: course.semesterId,
        name: course.semesterName,
        start: course.semesterStartDate,
        end: course.semesterEndDate,
        courses: [course]
      })
    return groups
  }, [])

function CourseRow({ course }) {
  const status = STATUSES[course.status] ?? { label: course.statusLabel, variant: 'secondary' }
  const href = sectionLinks(course.courseSectionId, {
    code: course.courseCode,
    section: course.sectionCode,
    name: course.courseName,
    time: course.time,
    semesterId: course.semesterId,
    semester: course.semesterName
  }).overview

  return (
    <li className={`flex flex-col gap-3 px-5 py-4 md:grid md:items-center md:gap-4 md:px-6 ${COLUMNS}`}>
      <Link href={href} className="group flex min-w-0 flex-col">
        <span className="font-display text-[17px] font-bold leading-6 group-hover:text-primary">
          {course.courseCode} · {course.sectionCode}
        </span>
        <span className="truncate text-sm text-muted-foreground">{course.courseName}</span>
      </Link>
      {/* On phones these three share a line; on desktop each takes a column */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
        <Badge variant={status.variant} className="w-fit">
          {status.label}
        </Badge>
        <div className="flex items-center gap-2">
          <span className="sr-only">Grade</span>
          {course.finalGrade !== null && (
            <span className="font-display text-base font-bold tabular-nums">{course.finalGrade}</span>
          )}
          {course.letterGrade ? (
            <LetterChip value={course.letterGrade} />
          ) : (
            <span className="text-muted-foreground" title="Not graded yet">
              —
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {course.sessionsMarked
            ? `${plural(course.absences, 'absence')} in ${plural(course.sessionsMarked, 'session')}`
            : 'No attendance yet'}
        </span>
      </div>
    </li>
  )
}

/**
 * A student's course sections, one card per semester, newest first.
 */
export function CourseHistory({ courses }) {
  if (courses.length === 0) {
    return (
      <div className="rounded-card-sm border border-dashed border-input bg-card px-6 py-12 text-center text-sm text-muted-foreground sm:rounded-card">
        No course sections yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {bySemester(courses).map((semester) => (
        <section
          key={semester.id}
          aria-labelledby={`semester-${semester.id}`}
          className="overflow-hidden rounded-card-sm border border-border bg-card shadow-card sm:rounded-card">
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border px-5 py-4 md:px-6">
            <h2 id={`semester-${semester.id}`} className="font-display text-[22px] font-bold leading-7">
              {semester.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatRange(toDay(semester.start), toDay(semester.end))} ·{' '}
              {plural(semester.courses.length, 'course')}
            </p>
          </header>
          <div
            aria-hidden="true"
            className={`hidden border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-[1.2px] text-faint md:grid md:gap-4 ${COLUMNS}`}>
            <span>Course</span>
            <span>Status</span>
            <span>Grade</span>
            <span>Attendance</span>
          </div>
          <ul className="divide-y divide-border">
            {semester.courses.map((course) => (
              <CourseRow key={course.enrollmentId} course={course} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
