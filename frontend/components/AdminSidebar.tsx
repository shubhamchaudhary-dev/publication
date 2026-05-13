'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, BookOpen, Settings, ChevronLeft, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/papers', label: 'Papers', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/admin/cms', label: 'CMS Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isRootAdmin = !!user?.isRootAdmin;

  return (
    <aside className="w-64 min-h-screen bg-[#1A3C5E] dark:bg-[#0D1B2E] flex flex-col">
      <div className="p-6 border-b border-white/10">
        {/* Site logo link */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg font-serif">
          <ChevronLeft className="w-4 h-4" />
          SwarnPublication
        </Link>

        {/* Admin role badge */}
        <div className="mt-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            isRootAdmin
              ? 'bg-gradient-to-br from-purple-500 to-purple-700 ring-2 ring-purple-400/30'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 ring-2 ring-blue-400/30'
          }`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            {isRootAdmin && (
              <p className="text-white text-sm font-bold leading-tight">Root</p>
            )}
            <p className="text-white/50 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-[#0D7C66] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
