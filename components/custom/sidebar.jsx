import { BackpackIcon, FileTextIcon } from '@radix-ui/react-icons'
import SidebarLink from './sidebar-link'

export function Sidebar({ className, ...props }) {
  return (
    <nav className={className} {...props}>
      {/* <SidebarLink
        icon={<PieChartIcon className="w-6 h-6" />}
        to="/admin/dashboard"
        name="Dashboard"
      /> */}
      <SidebarLink
        icon={<BackpackIcon className="w-6 h-6" />}
        to="/admin/semesters/list"
        name="Semesters"
      />
      <SidebarLink
        icon={<FileTextIcon className="w-6 h-6" />}
        to="/admin/courses/list"
        name="Courses"
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
