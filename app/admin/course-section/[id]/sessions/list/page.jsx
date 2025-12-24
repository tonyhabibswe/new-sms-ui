import { DataTable } from '@/components/custom/data-table/data-table'
import AddSessionButton from '@/components/custom/sessions/add-session/add-session-button'
import { columns } from '@/components/custom/sessions/data-table-list-columns'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { Fragment } from 'react'

export const metadata = {
  title: 'Sessions',
  description: 'Sessions'
}
export const revalidate = 0

const getData = async (id) => {
  const res = await fetchInstanceSSR(`/course-section/${id}/sessions`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch sessions')
  }
  const resJson = await res.json()
  return resJson.data
}

const SessionsListPage = async ({ params, searchParams }) => {
  const data = await getData(params.id)
  const courseCode = searchParams.code || ''
  const sectionCode = searchParams.section || ''
  const courseTime = searchParams.time || ''

  return (
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Sessions
          </h2>
          {(courseCode || sectionCode || courseTime) && (
            <p className="text-sm text-muted-foreground md:text-base">
              {[courseCode, sectionCode, courseTime].filter(Boolean).join(' - ')}
            </p>
          )}
        </div>
        <AddSessionButton />
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={Fragment}
        meta={{
          courseCode,
          sectionCode,
          courseTime
        }}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}

export default SessionsListPage
