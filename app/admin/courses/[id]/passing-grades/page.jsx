import { PassingGradesTable } from '@/components/custom/courses/passing-grades/passing-grades-table'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

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

const CoursePassingGradesPage = async ({ params, searchParams }) => {
  const courseId = params.id
  const data = await getData(courseId)

  // Get course info from URL params or fallback to data
  const courseInfo = {
    code: searchParams.code || (data.length > 0 ? data[0].courseCode : ''),
    name: searchParams.name || (data.length > 0 ? data[0].courseName : '')
  }

  return (
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Passing Grades
          </h2>
          {(courseInfo.code || courseInfo.name) && (
            <p className="text-sm text-muted-foreground md:text-base">
              {courseInfo.code} - {courseInfo.name}
            </p>
          )}
        </div>
      </div>
      <PassingGradesTable data={data} courseId={courseId} />
    </div>
  )
}

export default CoursePassingGradesPage
