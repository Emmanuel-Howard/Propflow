import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Mail,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: Mail,
    title: 'Email Campaigns',
    description:
      'Send professional newsletters to your client base with just a few clicks.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description:
      'Track open rates, click rates, and engagement to optimize your campaigns.',
  },
  {
    icon: Users,
    title: 'Contact Management',
    description:
      'Import and manage your contacts with easy CSV uploads and segmentation.',
  },
  {
    icon: Zap,
    title: 'High Deliverability',
    description:
      'Enterprise-grade email infrastructure ensures your emails land in inboxes.',
  },
]

const benefits = [
  'Bi-weekly or monthly newsletters',
  'Professional email templates',
  'Real-time analytics dashboard',
  'CSV contact import',
  'Mobile-responsive emails',
  'Dedicated support',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] rounded-lg flex items-center justify-center">
                <span className="text-[#d4af37] font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-semibold text-white">Propflow</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-sm text-slate-300 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Built for Real Estate Professionals
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Email Marketing That
            <br />
            <span className="text-[#d4af37]">Drives Results</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Help your real estate business grow with professional, data-driven
            email marketing. Acquire and retain clients with engaging
            newsletters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white px-8"
            >
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-2xl">
              <div className="bg-slate-800 rounded-lg h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-[#d4af37]" />
                  </div>
                  <p className="text-slate-400">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Propflow gives you all the tools to create, send, and track
              professional email campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#1e3a5f]/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#d4af37]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Built for Real Estate Success
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Whether you're a real estate agent, mortgage broker, or
                developer, Propflow helps you stay connected with your clients
                and grow your business.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                    <span className="text-[#d4af37] font-bold">24%</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Average Open Rate</p>
                    <p className="text-sm text-slate-400">
                      Industry-leading engagement
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                    <span className="text-[#d4af37] font-bold">5K+</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Emails Sent Daily</p>
                    <p className="text-sm text-slate-400">
                      Reliable infrastructure
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                    <span className="text-[#d4af37] font-bold">99%</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Delivery Rate</p>
                    <p className="text-sm text-slate-400">
                      Enterprise-grade deliverability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] rounded-2xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join real estate professionals who trust Propflow for their email
              marketing.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#d4af37] hover:bg-[#e5c048] text-slate-900 font-semibold px-8"
            >
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] rounded-lg flex items-center justify-center">
                <span className="text-[#d4af37] font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-semibold text-white">Propflow</span>
            </div>
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Propflow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
