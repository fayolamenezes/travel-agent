import './globals.css'
import Link from 'next/link'
import { Plane, Map, Bot } from 'lucide-react'

export const metadata = {
  title: 'AI Travel Guide',
  description: 'Personalized tour planner with AI + weather + streaming',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  themeColor: '#A7F3D0', // light green
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-slate-800 antialiased">
        {/* Skip link for accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] rounded-lg bg-green-700 px-3 py-2 text-white shadow"
        >
          Skip to content
        </a>

        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-green-300/40 bg-white/60 backdrop-blur-md shadow-sm">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-xl px-2 py-1 text-lg font-semibold text-green-800 transition-colors hover:text-green-900"
            >
              <Plane className="h-5 w-5 text-green-600 transition-transform group-hover:-rotate-6" />
              <span>AI Travel Guide</span>
            </Link>

            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-green-700 transition-colors hover:bg-green-100 hover:text-green-900"
              >
                <Bot className="h-4 w-4" />
                Itinerary Builder
              </Link>
              <Link
                href="/trips"
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-green-700 transition-colors hover:bg-green-100 hover:text-green-900"
              >
                <Map className="h-4 w-4" />
                Suggested Trips
              </Link>
            </div>
          </nav>
        </header>

        {/* Main container */}
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="rounded-3xl border border-green-200 bg-white/90 p-4 shadow-sm md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-4 pb-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-green-300/50 to-transparent mb-4" />
          <p className="text-center text-xs text-green-700">
            Built with <span className="font-medium">Next.js</span> · <span className="font-medium">OpenAI</span> ·{' '}
            <span className="font-medium">MongoDB</span> · <span className="font-medium">OpenWeather</span>
          </p>
        </footer>
      </body>
    </html>
  )
}
