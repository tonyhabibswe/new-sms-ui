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

const SessionsListPage = async ({ params }) => {
  const data = await getData(params.id)
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Sessions</h2>
        <AddSessionButton />
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={Fragment}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}

export default SessionsListPage
