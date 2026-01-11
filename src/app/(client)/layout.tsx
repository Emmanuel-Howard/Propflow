import { ClientSidebar } from '@/components/layout/client-sidebar'
import { ClientMobileNav } from '@/components/layout/client-mobile-nav'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ClientSidebar />
      </div>

      {/* Main Content */}
      <main className="md:pl-64 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <ClientMobileNav />
    </div>
  )
}
