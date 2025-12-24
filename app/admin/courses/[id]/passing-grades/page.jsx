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

const CoursePassingGradesPage = async ({ params }) => {
  const courseId = params.id
  const data = await getData(courseId)

  // Extract course info from the first passing grade if available
  const courseInfo =
    data.length > 0
      ? {
          code: data[0].courseCode,
          name: data[0].courseName
        }
      : null

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Passing Grades</h2>
          {courseInfo && (
            <p className="text-muted-foreground">
              Course: {courseInfo.code} - {courseInfo.name}
            </p>
          )}
        </div>
      </div>
      <PassingGradesTable data={data} courseId={courseId} />
    </div>
  )
}

export default CoursePassingGradesPage
