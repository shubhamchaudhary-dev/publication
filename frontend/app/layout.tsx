import type { Metadata } from 'next';
import './globals.css';
import './custom-home.css';
import ThemeProvider from '@/components/ThemeProvider';
import QueryProvider from './QueryProvider';
import AuthInit from './AuthInit';

export const metadata: Metadata = {
  title: 'SwapanPublication — Academic Research Platform',
  description: 'Discover, share, and explore peer-reviewed academic papers across all disciplines.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-[#FFFBEA]/50 to-[#FFFFFF] dark:bg-gradient-to-b dark:from-[#111111] dark:to-black text-[#0F172A] dark:text-[#F1F5F9]">
        <QueryProvider>
          <ThemeProvider>
            <AuthInit />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
