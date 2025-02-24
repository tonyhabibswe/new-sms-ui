import { Menu } from '@/components/custom/menu'
import { Sidebar } from '@/components/custom/sidebar'
import { NextAuthProvider } from '@/components/next-auth-provider'

export const metadata = {
  title: 'SMS',
  description:
    'SMS is an admin dashboard developed using NextJS and TailwindCSS'
}

const AdminLayout = async ({ children }) => {
  return (
    <NextAuthProvider>
      <Menu />
      <div className="bg-background">
        <Sidebar className="hidden px-2 pt-20 fixed top-0 left-0 bottom-0 md:w-64 border-r z-10 bg-background lg:flex space-x-2 lg:flex-col" />
        <div className="px-4 py-6 lg:px-8 lg:ml-64 mt-16">{children}</div>
      </div>
    </NextAuthProvider>
  )
}

export default AdminLayout
