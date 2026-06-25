'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, BookOpen, LogOut, User, ChevronDown } from 'lucide-react';
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
  return (
    <nav className="sticky top-0 z-50 bg-[var(--nav-bg)]" style={{ fontFamily: 'var(--font-sans)', fontSize: '15px' }}>
      <div className="w-full px-[2.5rem]">
        <div className="flex items-center justify-between h-[48px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline h-full">
            {/* Logo: swap src below when you have a real logo file */}
            <div className="relative h-[42px] w-[42px] shrink-0">
              <img
                src="/images/authors/logo.png"
                alt="Swapan Publication Logo"
                className="h-[42px] w-[42px] rounded-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }}
              />
              <div className="h-[42px] w-[42px] rounded-full bg-gradient-to-br from-[#0EA5A4] to-[#0077b5] items-center justify-center text-white font-bold text-base hidden absolute top-0 left-0" style={{ display: 'none' }}>
                SP
              </div>
            </div>
            <span className="font-serif text-[18px] font-bold tracking-tight text-[#19344f] dark:text-white">Swapan Publication</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-[2rem]">
            <div className="relative group">
              <button className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium flex items-center gap-1 h-[40px]">
                Publications <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-[35px] left-0 w-56 bg-white dark:bg-[#1E293B] shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all flex flex-col p-2 border border-gray-100 dark:border-gray-800">
                <Link href="/browse" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">Journals & Books</Link>
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
                <button onClick={handleLogout} className="flex items-center justify-center bg-[#19344f] dark:bg-white text-white dark:text-[#19344f] px-3.5 py-1 rounded-md text-[12px] font-bold hover:opacity-90 transition-opacity">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-[var(--nav-border)] pl-4 ml-2">
                <Link href="/signup" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Register</Link>
                <Link href="/login" className="flex items-center justify-center bg-[#19344f] dark:bg-white text-white dark:text-[#19344f] px-3.5 py-1 rounded-md text-[12px] font-bold hover:opacity-90 transition-opacity">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] p-2">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--nav-bg)] border-t border-[var(--nav-border)] px-4 py-4 flex flex-col gap-4 shadow-md">
          <Link href="/browse" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Journals & Books</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">About</Link>
          <Link href="/publish-guidelines" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Publishing Guidelines</Link>
          <Link href="/membership" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Membership</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Contact Us</Link>

          <div className="border-t border-[var(--nav-border)] my-2"></div>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Dashboard</Link>
              <Link href="/submit" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Submit</Link>
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-left text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Register</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
