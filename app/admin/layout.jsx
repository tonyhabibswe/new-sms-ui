'use client'

import { Menu } from '@/components/custom/menu'
import { Sidebar } from '@/components/custom/sidebar'
import { NextAuthProvider } from '@/components/next-auth-provider'
import { useState } from 'react'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <NextAuthProvider>
      <Menu onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="bg-background">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/80 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <Sidebar
          className={`fixed top-0 left-0 bottom-0 z-40 w-64 transform border-r bg-background px-2 pt-20 transition-transform duration-300 ease-in-out md:z-10 md:translate-x-0 lg:flex lg:flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:flex md:flex-col`}
          onLinkClick={() => setIsSidebarOpen(false)}
        />
        
        <div className="px-4 py-6 lg:px-8 lg:ml-64 mt-16">{children}</div>
      </div>
    </NextAuthProvider>
  )
}

export default AdminLayout
