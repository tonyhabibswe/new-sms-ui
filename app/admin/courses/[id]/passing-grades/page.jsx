import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { PageHeader } from '@/components/custom/layout/page-header'
import { PassingGradesTable } from '@/components/custom/courses/passing-grades/passing-grades-table'
import AddPassingGradeButton from '@/components/custom/courses/passing-grades/add-passing-grade-button'

export const metadata = {
  title: 'Course Passing Grades',
  description: 'Manage Course Passing Grades'
}
export const revalidate = 0

const getData = async (courseId) => {
  const res = await fetchInstanceSSR(
    `/course-passing-grades/course/${courseId}`,
    {
      cache: 'no-store'
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch course passing grades')
  }
  const resJson = await res.json()
  return resJson.data
}

const CoursePassingGradesPage = async (props) => {
  const params = await props.params
  const searchParams = await props.searchParams
  const courseId = params.id
  const data = await getData(courseId)

  const courseInfo = {
    code: searchParams.code || (data.length > 0 ? data[0].courseCode : ''),
    name: searchParams.name || (data.length > 0 ? data[0].courseName : '')
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        breadcrumbs={[
          { label: 'Courses', href: '/admin/courses/list' },
          { label: 'Passing grades' }
        ]}
        eyebrow={[courseInfo.code, courseInfo.name].filter(Boolean).join(' · ')}
        title="Passing grades"
        description="The final grade a student of each major needs to pass this course in a semester."
        actions={<AddPassingGradeButton courseId={courseId} />}
      />
      <PassingGradesTable data={data} />
    </div>
  )
}

export default CoursePassingGradesPage
