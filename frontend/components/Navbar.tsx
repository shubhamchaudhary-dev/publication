'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, BookOpen, LogOut, User } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] shadow-sm" style={{ fontFamily: 'var(--font-sans)', fontSize: '15px' }}>
      <div className="w-full px-[2.5rem]">
        <div className="flex items-center justify-between h-[58px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[8px] text-[var(--orange)] text-xl no-underline">
            <svg className="w-[28px] h-[22px]" viewBox="0 0 28 22" fill="none"><rect x={0} y={2} width={12} height={18} rx={2} fill="var(--orange)" /><rect x={4} y={0} width={12} height={18} rx={2} fill="var(--orange)" opacity=".5" /><rect x={14} y={4} width={14} height={14} rx={2} fill="var(--orange)" opacity=".8" /></svg>
            <span className="font-serif text-[18px] font-bold tracking-[-0.3px]">SwarnPublication</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-[2rem]">
            <Link href="/browse" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Journals & Books</Link>
            <Link href="/search" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Search</Link>
            <Link href="/about" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">About</Link>
            <Link href="/guidelines" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-[14px] font-medium">Publishing Guidelines</Link>
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
                <button onClick={handleLogout} className="flex items-center gap-1 text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-[14px] font-medium transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-[var(--nav-border)] pl-4 ml-2">
                <Link href="/signup" className="px-[18px] py-[7px] border border-[var(--btn-ghost-border)] rounded-md bg-transparent text-[var(--btn-ghost-text)] text-[13.5px] font-medium transition-all hover:border-[var(--btn-ghost-hover-border)] hover:text-[var(--btn-ghost-hover-text)]">Register</Link>
                <Link href="/login" className="px-[20px] py-[7px] rounded-md bg-[var(--btn-solid-bg)] text-[var(--btn-solid-text)] text-[13.5px] font-medium transition-colors hover:bg-[var(--btn-solid-hover)]">Sign In</Link>
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
          <Link href="/search" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Search</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">About</Link>
          <Link href="/guidelines" onClick={() => setMobileOpen(false)} className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] text-sm font-medium">Publishing Guidelines</Link>
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
