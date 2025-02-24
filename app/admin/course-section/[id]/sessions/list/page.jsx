import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from '@/components/custom/sessions/data-table-list-columns'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { Fragment } from 'react'

export const metadata = {
  title: 'Sessions',
  description: 'Sessions List'
}

const getData = async (id) => {
  const res = await fetchInstanceSSR(`/course-section/${id}/sessions`, {
    cache: 'no-store'
  })

  if (res.status === 401) throw new Error(res.statusText)
  if (!res.ok) {
    throw new Error('Failed to fetch sessions')
  }
  const resJson = await res.json()
  return resJson.data
}

const SessionsListPage = async ({ params }) => {
  let data = []
  let error = ''

  try {
    data = await getData(params.id)
  } catch (exception) {
    if (error.message === 'Unauthorized') await signOut({ redirect: false })
    error = exception.message
  }
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Sessions List</h2>
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={Fragment}
        error={error}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}

export default SessionsListPage
