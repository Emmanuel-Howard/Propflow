export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] rounded-lg flex items-center justify-center">
              <span className="text-[#d4af37] font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-semibold text-white">Propflow</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
