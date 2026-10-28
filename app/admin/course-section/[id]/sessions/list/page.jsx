import { Fragment } from 'react'
import { DataTable } from '@/components/custom/data-table/data-table'
import { PageHeader } from '@/components/custom/layout/page-header'
import AddSessionButton from '@/components/custom/sessions/add-session/add-session-button'
import { columns } from '@/components/custom/sessions/data-table-list-columns'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { pickSectionParams, sectionCrumbs, sectionTitle } from '@/lib/section-links'

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

const SessionsListPage = async (props) => {
  const params = await props.params
  const searchParams = await props.searchParams
  const data = await getData(params.id)
  const sectionParams = pickSectionParams(searchParams)

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        breadcrumbs={[...sectionCrumbs(params.id, sectionParams), { label: 'Sessions' }]}
        eyebrow={[sectionTitle(sectionParams), sectionParams.name].filter(Boolean).join(' · ')}
        title="Sessions"
        description={[sectionParams.time, sectionParams.room].filter(Boolean).join(' · ')}
        actions={<AddSessionButton />}
      />
      <DataTable
        data={data}
        columns={columns}
        toolbar={Fragment}
        meta={{ sectionId: params.id, sectionParams }}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}

export default SessionsListPage
