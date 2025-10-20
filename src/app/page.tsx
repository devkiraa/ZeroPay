import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Code2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-gray-900">
              ZeroPay
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/merchant/login"
              className="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/merchant/signup"
              className="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg shadow-md bg-accent text-white hover:bg-emerald-400"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-grow">
        <section className="py-24 text-center md:py-32 lg:py-40 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 mx-auto max-w-7xl md:px-6">
            <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900 md:text-5xl lg:text-6xl">
              Make Payments Simple.
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl text-gray-700">
              ZeroPay is a mock payment gateway for developers. Test, learn, and
              build powerful portfolio projects with a complete payment
              simulation.
            </p>
            <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
              <Link
                href="/merchant/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 font-medium transition-all duration-300 rounded-lg shadow-lg bg-accent text-white hover:bg-emerald-400 active:scale-95"
              >
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 font-medium transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-lg text-gray-900 hover:bg-gray-50 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Features Grid */}
        <section id="features" className="py-20 md:py-32 bg-white">
          <div className="container px-4 mx-auto max-w-7xl md:px-6">
            <h2 className="mb-12 text-3xl font-bold text-center text-gray-900 md:text-4xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="p-6 transition-all duration-300 border-2 rounded-2xl bg-white border-gray-200 hover:border-accent hover:shadow-xl">
                <ShieldCheck className="w-10 h-10 mb-4 text-accent" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Merchant Dashboard
                </h3>
                <p className="text-gray-700">
                  A complete, responsive dashboard to view transactions,
                  analytics, and manage your API keys.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="p-6 transition-all duration-300 border-2 rounded-2xl bg-white border-gray-200 hover:border-accent hover:shadow-xl">
                <Code2 className="w-10 h-10 mb-4 text-accent" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Developer-First API
                </h3>
                <p className="text-gray-700">
                  Simple REST endpoints to create, verify, and check payment
                  statuses. Built for learning.
                </p>
              </div>
              {/* Feature Card 3 */}
              <div className="p-6 transition-all duration-300 border-2 rounded-2xl bg-white border-gray-200 hover:border-accent hover:shadow-xl">
                <Lock className="w-10 h-10 mb-4 text-accent" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Mock Security
                </h3>
                <p className="text-gray-700">
                  Simulates JWT authentication, HMAC signature verification, and
                  secure webhooks without financial risk.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="py-6 border-t border-gray-200 bg-gray-50">
        <div className="container flex flex-col items-center justify-between px-4 mx-auto max-w-7xl md:flex-row md:px-6">
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} ZeroPay. A portfolio project.
          </p>
          <p className="text-sm text-gray-700">
            Not a real payment processor.
          </p>
        </div>
      </footer>
    </div>
  );
}