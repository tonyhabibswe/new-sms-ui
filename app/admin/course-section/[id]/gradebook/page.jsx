import GradebookTabs from '@/components/custom/gradebook/gradebook-tabs'
import { PageHeader } from '@/components/custom/layout/page-header'
import { pickSectionParams, sectionCrumbs, sectionTitle } from '@/lib/section-links'

export default async function GradebookPage(props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const sectionParams = pickSectionParams(searchParams)

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        breadcrumbs={[...sectionCrumbs(params.id, sectionParams), { label: 'Gradebook' }]}
        eyebrow={[sectionTitle(sectionParams), sectionParams.name].filter(Boolean).join(' · ')}
        title="Gradebook"
      />
      <GradebookTabs courseSectionId={params.id} />
    </div>
  )
}
