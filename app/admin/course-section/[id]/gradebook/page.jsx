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
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-3xl">
            Gradebook
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {courseSection.courseCode} - {courseSection.section} -{' '}
            {courseSection.courseName}
          </p>
        </div>
      </div>

      <GradebookTabs courseSectionId={id} />
    </div>
  )
}
