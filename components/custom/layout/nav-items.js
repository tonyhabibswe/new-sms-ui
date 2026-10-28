import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react'

// Course sections, sessions and attendance live under a semester, so they keep
// Semesters highlighted.
export const NAV_ITEMS = [
  {
    name: 'Semesters',
    href: '/admin/semesters/list',
    icon: Calendar,
    match: ['/admin/semester', '/admin/course-section', '/admin/session']
  },
  {
    name: 'Courses',
    href: '/admin/courses/list',
    icon: BookOpen,
    match: ['/admin/courses']
  },
  {
    name: 'Students',
    href: '/admin/students/list',
    icon: Users,
    match: ['/admin/students']
  },
  {
    name: 'Majors',
    href: '/admin/majors/list',
    icon: GraduationCap,
    match: ['/admin/majors']
  }
]

export const isActive = (item, pathname) =>
  item.match.some((prefix) => pathname?.startsWith(prefix))
