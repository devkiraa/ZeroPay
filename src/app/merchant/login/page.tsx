'use client'; // This is a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push('/merchant/dashboard');
    } else {
      setError(data.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-light-background">
      {/* Left Side: Brand (Stays dark) */}
      <div className="flex items-center justify-center w-full p-8 py-12 md:w-1/2 bg-primary-dark">
        <div className="max-w-md text-center text-white">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Zap className="w-10 h-10 text-accent" />
            <span className="text-4xl font-bold">ZeroPay</span>
          </Link>
          <h1 className="mb-4 text-3xl font-bold">Welcome Back</h1>
          <p className="text-lg text-text-dark-secondary">
            Log in to your merchant dashboard to view payments, manage API keys,
            and more.
          </p>
        </div>
      </div>

      {/* Right Side: Form Card (Light Theme) */}
      <div className="flex items-center justify-center w-full p-8 md:w-1/2 bg-light-background">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1 mb-6 text-sm transition-colors text-accent hover:text-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Form Card */}
          <div className="p-8 rounded-2xl bg-primary-light shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-center text-text-light-primary">
              Merchant Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-text-light-secondary"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-text-light-secondary"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="px-4 py-2 text-sm text-center text-red-700 bg-red-100 border border-red-300 rounded-lg"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 font-medium text-primary-dark bg-accent rounded-lg shadow-md transition-all duration-300 hover:bg-emerald-400 active:scale-95"
                >
                  Log In
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-text-light-secondary">
              Don&apos;t have an account?{' '}
              <Link
                href="/merchant/signup"
                className="font-medium text-accent hover:text-emerald-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}