'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, BookOpen, Settings, ChevronLeft, Shield, Mail, Megaphone, MessageSquare, CreditCard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/papers', label: 'Papers', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/subjects', label: 'Journals', icon: BookOpen },
  { href: '/admin/inquiries', label: 'Contact Inquiries', icon: Mail },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Megaphone },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/cms', label: 'CMS Settings', icon: Settings },
];

interface AdminSidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ className, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isRootAdmin = !!user?.isRootAdmin;

  const sidebarContent = (
    <aside className={cn("w-64 min-h-screen bg-[#1A3C5E] dark:bg-[#0D1B2E] flex flex-col", className)}>
      <div className="p-6 border-b border-white/10">
        {/* Site logo link */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg font-serif">
            <ChevronLeft className="w-4 h-4" />
            SwapanPublication
          </Link>
          {/* Close button — only shown on mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/60 hover:text-white rounded-md min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

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
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
              pathname === href
                ? 'bg-[#0D7C66] text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile: off-canvas drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 flex">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}


