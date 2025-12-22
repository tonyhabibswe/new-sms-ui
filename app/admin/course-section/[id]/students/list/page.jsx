/**
 * Students List Redirect Page
 *
 * This page redirects to the Gradebook page with the Attendance tab active.
 * Maintains backward compatibility for existing bookmarks and navigation links.
 */
import { redirect } from 'next/navigation'

export default function StudentsListRedirect({ params }) {
  redirect(`/admin/course-section/${params.id}/gradebook?tab=attendance`)
}
