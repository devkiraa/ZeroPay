'use client'; // This is a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess(data.message);
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/merchant/login');
      }, 1500);
    } else {
      setError(data.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-light-background">
      {/* Left Side: Brand Gradient (Stays dark as per your brief) */}
      <div className="flex items-center justify-center w-full p-8 py-12 md:w-1/2 bg-primary-dark">
        <div className="max-w-md text-center text-white">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Zap className="w-10 h-10 text-accent" />
            <span className="text-4xl font-bold">ZeroPay</span>
          </Link>
          <h1 className="mb-4 text-3xl font-bold">
            Start Accepting Payments
          </h1>
          <p className="text-lg text-text-dark-secondary">
            Join thousands of developers building, testing, and learning about
            payment systems.
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
              Create Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-text-light-secondary"
                >
                  Business Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-background border border-gray-300 text-text-light-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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
                  minLength={6}
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

              {/* Success Message */}
              {success && (
                <div
                  className="px-4 py-2 text-sm text-center text-green-700 bg-green-100 border border-green-300 rounded-lg"
                  role="alert"
                >
                  {success} Redirecting...
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 font-medium text-primary-dark bg-accent rounded-lg shadow-md transition-all duration-300 hover:bg-emerald-400 active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-text-light-secondary">
              Already have an account?{' '}
              <Link
                href="/merchant/login"
                className="font-medium text-accent hover:text-emerald-400"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}