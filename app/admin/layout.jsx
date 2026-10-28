import { NextAuthProvider } from '@/components/next-auth-provider'
import { AppSidebar } from '@/components/custom/layout/app-sidebar'
import { MobileTabBar } from '@/components/custom/layout/mobile-tab-bar'
import { MobileTopBar } from '@/components/custom/layout/mobile-top-bar'

const AdminLayout = ({ children }) => {
  return (
    <NextAuthProvider>
      <div className="min-h-screen bg-background lg:flex">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          <main className="mx-auto w-full max-w-[1296px] px-5 pb-28 pt-4 sm:px-8 lg:px-12 lg:pb-16 lg:pt-8">
            {children}
          </main>
        </div>
        <MobileTabBar />
      </div>
    </NextAuthProvider>
  )
}

export default AdminLayout
