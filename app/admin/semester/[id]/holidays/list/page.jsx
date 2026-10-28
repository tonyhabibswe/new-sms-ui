import { notFound } from 'next/navigation'
import { DataTable } from '@/components/custom/data-table/data-table'
import AddHolidayButton from '@/components/custom/holidays/AddHoliday/add-holiday-button'
import { columns } from '@/components/custom/holidays/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/holidays/data-table-list-toolbar'
import { SemesterHeader } from '@/components/custom/semesters/semester-header'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { getSemester, getSemesterSections } from '@/lib/semesters-server'

export const metadata = {
  title: 'Holidays',
  description: 'Holidays List'
}
export const revalidate = 0

const getData = async (id) => {
  const res = await fetchInstanceSSR(`/semester/${id}/holidays`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const HolidaysListPage = async (props) => {
  const params = await props.params
  const [semester, data, sections] = await Promise.all([
    getSemester(params.id),
    getData(params.id),
    getSemesterSections(params.id)
  ])
  if (!semester) notFound()

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <SemesterHeader
        semester={semester}
        active="holidays"
        sectionCount={sections.length}
        holidayCount={data.length}
        action={<AddHolidayButton />}
      />
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}

export default HolidaysListPage
