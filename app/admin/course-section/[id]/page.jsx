import Link from 'next/link'
import { format, isToday } from 'date-fns'
import { Calendar, ClipboardCheck, Clock, List, MapPin, Sheet, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/custom/layout/page-header'
import { ImportStudentsTile } from '@/components/custom/course-sections/import-students-tile'
import { SectionTile } from '@/components/custom/course-sections/section-tile'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import {
  attendanceLink,
  pickSectionParams,
  sectionCrumbs,
  sectionLinks,
  sectionTitle,
  toDateTime
} from '@/lib/section-links'

export const metadata = {
  title: 'Course section',
  description: 'Course section overview'
}
export const revalidate = 0

// The overview's numbers are extras: a failed request leaves its tile without one
const getList = async (path) => {
  const res = await fetchInstanceSSR(path, { cache: 'no-store' })
  if (!res.ok) return null
  const resJson = await res.json()
  return resJson.data
}

const CourseSectionPage = async (props) => {
  const params = await props.params
  const searchParams = await props.searchParams
  const sectionParams = pickSectionParams(searchParams)
  const links = sectionLinks(params.id, sectionParams)
  const title = sectionTitle(sectionParams) || 'Course section'

  const [sessions, students, grades] = await Promise.all([
    getList(`/course-section/${params.id}/sessions`),
    getList(`/course-section/${params.id}/students`),
    getList(`/course-sections/${params.id}/grades/table`)
  ])

  // The API reports a 0 average before anything is graded
  const gradeKeys =
    grades?.columns?.filter((col) => col.type === 'gradeableItem').map((col) => col.key) ?? []
  const hasGrades = Boolean(
    grades?.rows?.some((row) =>
      gradeKeys.some((key) => {
        const cell = row[key]
        return (cell && typeof cell === 'object' ? cell.value : cell) != null
      })
    )
  )

  // Sessions come newest first and stop at today
  const latest = sessions?.[0]
  const latestStart = latest ? toDateTime(latest.sessionStart) : null
  const latestIsToday = latestStart ? isToday(latestStart) : false

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        breadcrumbs={sectionCrumbs(params.id, sectionParams)}
        eyebrow="Course section"
        title={title}
        description={sectionParams.name}>
        <div className="flex flex-wrap gap-2">
          {sectionParams.time && (
            <Badge variant="secondary">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {sectionParams.time}
            </Badge>
          )}
          {sectionParams.room && (
            <Badge variant="secondary">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {sectionParams.room}
            </Badge>
          )}
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-6">
        <section
          aria-labelledby="next-session"
          className="flex flex-col gap-4 rounded-card-sm border border-brand-400/30 bg-card p-5 shadow-hero sm:rounded-card sm:p-6">
          {latest ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p
                    id="next-session"
                    className="text-xs font-semibold uppercase tracking-eyebrow text-faint">
                    {latestIsToday ? 'Today' : 'Latest session'}
                  </p>
                  <p className="font-display text-xl font-bold leading-[26px]">
                    {format(latestStart, 'EEE, MMM d')} · {format(latestStart, 'HH:mm')}
                  </p>
                  {latest.room && (
                    <p className="text-sm text-muted-foreground">Room {latest.room}</p>
                  )}
                </div>
                <Calendar className="h-5 w-5 text-faint" aria-hidden="true" />
              </div>
              <Link
                href={attendanceLink(latest.id, params.id, sectionParams, latest)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                Take attendance
              </Link>
            </>
          ) : (
            <>
              <p id="next-session" className="font-display text-xl font-bold leading-[26px]">
                No sessions yet
              </p>
              <p className="text-sm text-muted-foreground">
                Sessions appear here once the semester reaches this section&apos;s first class.
              </p>
            </>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <SectionTile
            href={links.gradebook}
            icon={Sheet}
            label="Gradebook"
            caption={
              hasGrades && grades.classAverage != null
                ? `Average ${Number(grades.classAverage).toFixed(1)}`
                : 'No grades yet'
            }
          />
          <SectionTile
            href={links.sessions}
            icon={List}
            label="Sessions"
            caption={sessions ? `${sessions.length} so far` : 'Every class'}
          />
          <SectionTile
            href={links.students}
            icon={Users}
            label="Students"
            caption={students ? `${students.length} enrolled` : 'Enrolment status'}
          />
          <ImportStudentsTile sectionId={params.id} title={title} />
        </div>
      </div>
    </div>
  )
}

export default CourseSectionPage
