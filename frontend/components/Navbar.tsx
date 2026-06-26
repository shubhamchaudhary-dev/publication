'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--nav-bg)]" style={{ fontFamily: 'var(--font-sans)', fontSize: '15px' }}>
      <div className="w-full px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[48px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline h-full min-w-0 shrink-0">
            <div className="relative h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] shrink-0">
              <img
                src="/images/authors/logo.png"
                alt="Swapan Publication Logo"
                className="h-full w-full rounded-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }}
              />
              <div className="h-full w-full rounded-full bg-gradient-to-br from-[#0EA5A4] to-[#0077b5] items-center justify-center text-white font-bold text-base hidden absolute top-0 left-0" style={{ display: 'none' }}>
                SP
              </div>
            </div>
            <span className="font-serif text-[15px] sm:text-[18px] font-bold tracking-tight text-[#19344f] dark:text-white truncate">
              <span className="hidden sm:inline">Swapan Publication</span>
              <span className="sm:hidden">Swapan</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-[2rem]">
            <div className="relative group">
              <button className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium flex items-center gap-1 h-[40px]" aria-haspopup="true">
                Publications <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-[35px] left-0 w-56 bg-white dark:bg-[#1E293B] shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all flex flex-col p-2 border border-gray-100 dark:border-gray-800">
                <Link href="/browse" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">Journals &amp; Books</Link>
                <Link href="/publish-guidelines" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">Publishing Guidelines</Link>
              </div>
            </div>
            <Link href="/about" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">About</Link>
            <Link href="/membership" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Membership</Link>
            <Link href="/contact" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Contact Us</Link>
          </div>

          {/* Desktop Auth / Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-[var(--nav-border)] pl-4 ml-2">
                <Link href="/dashboard" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Dashboard</Link>
                <Link href="/submit" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Submit</Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Admin</Link>
                )}
                <button onClick={handleLogout} className="flex items-center justify-center bg-[#19344f] dark:bg-white text-white dark:text-[#19344f] px-3.5 py-1 rounded-md text-[12px] font-bold hover:opacity-90 transition-opacity min-h-[36px]">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-[var(--nav-border)] pl-4 ml-2">
                <Link href="/signup" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Register</Link>
                <Link href="/login" className="flex items-center justify-center bg-[#19344f] dark:bg-white text-white dark:text-[#19344f] px-3.5 py-1 rounded-md text-[12px] font-bold hover:opacity-90 transition-opacity min-h-[36px]">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile — theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] p-2 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#0077b5]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden bg-[var(--nav-bg)] border-t border-[var(--nav-border)] px-4 py-3 flex flex-col shadow-md">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-semibold px-2 pt-1 pb-0.5">Publications</span>
            <Link href="/browse" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Journals &amp; Books</Link>
            <Link href="/publish-guidelines" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Publishing Guidelines</Link>
            <Link href="/about" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">About</Link>
            <Link href="/membership" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Membership</Link>
            <Link href="/contact" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Contact Us</Link>
          </div>

          <div className="border-t border-[var(--nav-border)] my-2" />

          {isAuthenticated ? (
            <div className="flex flex-col gap-0.5">
              <Link href="/dashboard" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Dashboard</Link>
              <Link href="/submit" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Submit Paper</Link>
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Admin Panel</Link>
              )}
              <button onClick={() => { closeMobile(); handleLogout(); }} className="text-left text-red-500 dark:text-red-400 text-sm font-medium px-2 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 min-h-[44px] flex items-center w-full">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/signup" onClick={closeMobile} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium px-2 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 min-h-[44px] flex items-center">Register</Link>
              <Link href="/login" onClick={closeMobile} className="bg-[#19344f] dark:bg-white text-white dark:text-[#19344f] text-sm font-bold px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity text-center min-h-[44px] flex items-center justify-center">
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

