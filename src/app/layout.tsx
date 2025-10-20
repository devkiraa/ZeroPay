import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'ZeroPay - Modern Mock Payment Gateway',
  description: 'Simulate real-world payment processing for your projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. REMOVED className="dark" from here
    <html lang="en">
      <body
        // 2. UPDATED these classes to your light theme colors
        className={`${inter.variable} font-sans bg-light-background text-text-light-primary`}
      >
        {children}
      </body>
    </html>
  );
}