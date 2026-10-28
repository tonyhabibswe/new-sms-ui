import { notFound } from 'next/navigation'
import AddCourseButton from '@/components/custom/course-sections/add-course-button'
import { columns } from '@/components/custom/course-sections/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/course-sections/data-table-list-toolbar'
import { DataTable } from '@/components/custom/data-table/data-table'
import { SemesterHeader } from '@/components/custom/semesters/semester-header'
import { getSemester, getSemesterSections } from '@/lib/semesters-server'

export const metadata = {
  title: 'Course Sections',
  description: 'Course Sections'
}
export const revalidate = 0

const CoursesListPage = async (props) => {
  const params = await props.params
  const [semester, data] = await Promise.all([
    getSemester(params.id),
    getSemesterSections(params.id)
  ])
  if (!semester) notFound()

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <SemesterHeader
        semester={semester}
        active="sections"
        sectionCount={data.length}
        holidayCount={semester.holidayCount}
        action={<AddCourseButton />}
      />
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        meta={{ semester: { id: semester.id, name: semester.name } }}
        columnVisibilityInitialState={{
          id: false,
          curveAlgorithm: false
        }}
      />
    </div>
  )
}

export default CoursesListPage
