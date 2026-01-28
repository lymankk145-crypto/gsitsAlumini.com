import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-600 text-white">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">AlumniConnect</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Reconnect with Your Alumni Network
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Find classmates, explore career paths, and build meaningful professional connections with fellow alumni.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="px-8 py-6 text-lg text-white border-white hover:bg-white hover:text-blue-600 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Discover Alumni</h3>
              <p className="text-blue-100">
                Browse detailed profiles of alumni and find people from your graduation year or working in your field.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Connect & Message</h3>
              <p className="text-blue-100">
                Send connection requests and message alumni directly to network and share experiences.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-blue-100">
                Learn about career opportunities, gain insights, and build your professional network.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
