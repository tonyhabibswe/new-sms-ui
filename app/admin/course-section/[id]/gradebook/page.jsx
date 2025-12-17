import GradebookTabs from '@/components/custom/gradebook/gradebook-tabs'

export default async function GradebookPage({ params, searchParams }) {
  const { id } = params

  // Get course info from URL params or use defaults
  const courseSection = {
    id: parseInt(id),
    courseCode: searchParams.code || 'Course',
    section: searchParams.section || 'Section',
    courseName: searchParams.name || 'Course Name'
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground">
            {courseSection.courseCode} - {courseSection.section} -{' '}
            {courseSection.courseName}
          </p>
        </div>
      </div>

      <GradebookTabs courseSectionId={id} />
    </div>
  )
}
