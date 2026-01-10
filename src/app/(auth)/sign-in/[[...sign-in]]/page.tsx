import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white',
          card: 'bg-slate-800/50 backdrop-blur border border-slate-700',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-400',
          socialButtonsBlockButton:
            'bg-slate-700 border-slate-600 text-white hover:bg-slate-600',
          formFieldLabel: 'text-slate-300',
          formFieldInput:
            'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400',
          footerActionLink: 'text-[#d4af37] hover:text-[#e5c048]',
          identityPreviewEditButton: 'text-[#d4af37]',
        },
      }}
    />
  )
}
