import { format } from 'date-fns'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { AttendanceSheet } from '@/components/custom/attendance/attendance-sheet'
import { DataTableActionOptions as ExportAttendanceButton } from '@/components/custom/course-sections/students/data-table-action-options'
import { PageHeader } from '@/components/custom/layout/page-header'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import {
  pickSectionParams,
  sectionCrumbs,
  sectionLinks,
  sectionTitle,
  toDateTime
} from '@/lib/section-links'

export const metadata = {
  title: 'Attendance',
  description: 'Attendance List'
}
export const revalidate = 0

const getData = async (id) => {
  const res = await fetchInstanceSSR(
    `/course-session/${id}/attendances/list-students`,
    {
      cache: 'no-store'
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch attendance')
  }
  const resJson = await res.json()
  return resJson.data
}

const AttendanceList = async (props) => {
  const params = await props.params
  const searchParams = await props.searchParams
  const data = await getData(params.id)
  const sectionParams = pickSectionParams(searchParams)
  const { sectionId } = searchParams

  // Links from the sessions list carry the session's start and end; older
  // links only had a preformatted date and the section's weekly time
  const start = searchParams.start ? toDateTime(searchParams.start) : null
  const end = searchParams.end ? toDateTime(searchParams.end) : null
  const dateLabel = start ? format(start, 'EEEE, MMMM d, yyyy') : searchParams.date
  const timeLabel =
    start && end ? `${format(start, 'HH:mm')}–${format(end, 'HH:mm')}` : searchParams.time

  const breadcrumbs = sectionId
    ? [
        ...sectionCrumbs(sectionId, sectionParams),
        { label: 'Sessions', href: sectionLinks(sectionId, sectionParams).sessions },
        { label: start ? format(start, 'EEE, MMM d') : 'Attendance' }
      ]
    : [{ label: 'Semesters', href: '/admin/semesters/list' }, { label: 'Attendance' }]

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow={[sectionTitle(sectionParams), sectionParams.name].filter(Boolean).join(' · ')}
        title="Attendance"
        actions={
          sectionId ? (
            <ExportAttendanceButton sectionId={sectionId} className="hidden md:inline-flex" />
          ) : null
        }>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[15px] text-muted-foreground">
          {dateLabel && (
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {dateLabel}
            </span>
          )}
          {timeLabel && (
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {timeLabel}
            </span>
          )}
          {searchParams.room && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Room {searchParams.room}
            </span>
          )}
        </div>
      </PageHeader>
      <AttendanceSheet sessionId={params.id} students={data} />
    </div>
  )
}

export default AttendanceList
