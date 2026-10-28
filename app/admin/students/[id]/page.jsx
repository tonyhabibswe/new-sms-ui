import { notFound } from 'next/navigation'
import { GraduationCap, Mail, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/custom/layout/page-header'
import { CourseHistory } from '@/components/custom/students/course-history'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Student',
  description: 'A student and the courses they took'
}
export const revalidate = 0

const getStudent = async (id) => {
  const res = await fetchInstanceSSR(`/student/${id}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error('Failed to fetch the student')
  }
  const resJson = await res.json()
  return resJson.data
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-card-sm border border-border bg-card px-5 py-4 shadow-card">
      <span className="font-display text-2xl font-bold leading-8">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-[1.2px] text-faint">{label}</span>
    </div>
  )
}

const StudentPage = async (props) => {
  const params = await props.params
  const student = await getStudent(params.id)
  if (!student) notFound()

  const name = `${student.firstName} ${student.lastName}`

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        breadcrumbs={[
          { label: 'Students', href: '/admin/students/list' },
          { label: name }
        ]}
        eyebrow={`Student · ${student.studentId}`}
        title={name}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-muted-foreground">
          {student.major && (
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
              {student.major}
            </span>
          )}
          <a
            href={`mailto:${student.email}`}
            className="inline-flex min-w-0 items-center gap-2 break-all hover:text-primary">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            {student.email}
          </a>
          {student.campus && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {student.campus} campus
            </span>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
        <Stat label="Courses taken" value={student.coursesCount} />
        <Stat label="Semesters" value={student.semestersCount} />
      </div>

      <CourseHistory courses={student.courses} />
    </div>
  )
}

export default StudentPage
