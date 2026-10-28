import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { describeSemester } from '@/lib/semesters'

// Server-side reads shared by the semester pages. The API has no endpoint for
// one semester, so getSemester picks it out of the list.

export async function getSemesters() {
  const res = await fetchInstanceSSR('/semesters', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch semesters')
  }
  const resJson = await res.json()
  return resJson.data.map((semester) => describeSemester(semester))
}

export async function getSemester(id) {
  const semesters = await getSemesters()
  return semesters.find((semester) => String(semester.id) === String(id)) ?? null
}

export async function getSemesterSections(id) {
  const res = await fetchInstanceSSR(`/semester/${id}/courses`, {
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}
