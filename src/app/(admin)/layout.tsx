import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminMobileNav } from '@/components/layout/admin-mobile-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="md:pl-64 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <AdminMobileNav />
    </div>
  )
}
