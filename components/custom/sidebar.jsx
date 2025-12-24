import { BackpackIcon, FileTextIcon, ReaderIcon } from '@radix-ui/react-icons'
import SidebarLink from './sidebar-link'
import { GraduationCap } from 'lucide-react'

export function Sidebar({ className, onLinkClick, ...props }) {
  return (
    <nav className={className} {...props}>
      {/* <SidebarLink
        icon={<PieChartIcon className="w-6 h-6" />}
        to="/admin/dashboard"
        name="Dashboard"
        onClick={onLinkClick}
      /> */}
      <SidebarLink
        icon={<BackpackIcon className="w-6 h-6" />}
        to="/admin/semesters/list"
        name="Semesters"
        onClick={onLinkClick}
      />
      <SidebarLink
        icon={<FileTextIcon className="w-6 h-6" />}
        to="/admin/courses/list"
        name="Courses"
        onClick={onLinkClick}
      />
      <SidebarLink
        icon={<GraduationCap className="w-6 h-6" />}
        to="/admin/majors/list"
        name="Majors"
        onClick={onLinkClick}
      />
      {/* <SidebarCollapsibleLink
        icon={<PersonIcon className="w-6 h-6" />}
        name="Users">
        <SidebarNestedLink to="/admin/users/list" name="Users List" />
        <SidebarNestedLink to="/test1/test4" name="DD123" />
      </SidebarCollapsibleLink> */}
    </nav>
  )
}
