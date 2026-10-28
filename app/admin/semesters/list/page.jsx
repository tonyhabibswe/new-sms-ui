import { PageHeader } from '@/components/custom/layout/page-header'
import AddSemesterButton from '@/components/custom/semesters/AddSemester/add-semester-button'
import { SemestersOverview } from '@/components/custom/semesters/semesters-overview'
import { getSemesterSections, getSemesters } from '@/lib/semesters-server'

export const metadata = {
  title: 'Semesters',
  description: 'Semester List'
}
export const revalidate = 0

const SemestersListPage = async () => {
  const semesters = await getSemesters()
  const current = semesters.find((semester) => semester.status === 'in-progress') ?? null
  const currentSections = current ? await getSemesterSections(current.id) : null

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Academic calendar"
        title="Semesters"
        description="Plan each term, its holidays and the course sections you teach."
        actions={<AddSemesterButton />}
      />
      <SemestersOverview
        semesters={semesters}
        current={current}
        currentSectionCount={currentSections?.length ?? null}
      />
    </div>
  )
}
export default SemestersListPage
