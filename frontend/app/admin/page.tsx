'use client';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, CheckCircle, Clock, Send, XCircle, FileText, IndianRupee, CreditCard } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface AdminStats {
  totalUsers: number;
  totalPapers: number;
  published: number;
  underReview: number;
  submitted: number;
  rejected: number;
  paymentPending: number;
  paymentCompleted: number;
  successfulPayments: number;
  failedPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useQuery<{ data: AdminStats }>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => (await api.get('/api/admin/stats')).data,
    refetchInterval: 30_000, // Auto-refresh every 30 seconds
  });

  const stats = statsData?.data ?? {
    totalUsers: 0,
    totalPapers: 0,
    published: 0,
    underReview: 0,
    submitted: 0,
    rejected: 0,
    paymentPending: 0,
    paymentCompleted: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-900/50',
      href: '/admin/users',
    },
    {
      label: 'Total Papers',
      value: stats.totalPapers,
      icon: FileText,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
      href: '/admin/papers',
    },
    {
      label: 'Published',
      value: stats.published,
      icon: CheckCircle,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-900/50',
      href: '/admin/papers?status=published',
    },
    {
      label: 'Under Review',
      value: stats.underReview,
      icon: Clock,
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-900/50',
      href: '/admin/papers?status=under_review',
    },
    {
      label: 'Submitted',
      value: stats.submitted,
      icon: Send,
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-900/50',
      href: '/admin/papers?status=submitted',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-900/50',
      href: '/admin/papers?status=rejected',
    },
    {
      label: 'Awaiting Payment',
      value: stats.paymentPending,
      icon: Clock,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-900/50',
      href: '/admin/papers?status=payment_pending',
    },
    {
      label: 'Successful Payments',
      value: stats.successfulPayments,
      icon: CreditCard,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      href: '#',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-900/50',
      href: '#',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-900/50',
      href: '#',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Dashboard</h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Live overview — refreshes every 30 seconds
          </p>
        </div>
        <Link
          href="/admin/papers"
          className="text-sm font-medium text-[#0D7C66] hover:underline"
        >
          Manage all papers →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map(({ label, value, icon: Icon, color, border, href }) => (
            <Link
              key={label}
              href={href}
              className={`bg-white dark:bg-[#1F2937] rounded-xl border ${border} p-6 flex items-center gap-5 hover:shadow-md transition-shadow group`}
            >
              <div className={`p-4 rounded-xl ${color} flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">
                  {value}
                </div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5 group-hover:text-[#0D7C66] transition-colors">
                  {label}
                </div>
              </div>
            </Link>
          ))}
        </div>

      {/* Quick actions */}
      <div className="mt-10 bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
        <h2 className="font-serif text-lg font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/papers?status=submitted" className="px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
            Review Submitted Papers
          </Link>
          <Link href="/admin/papers?status=under_review" className="px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors">
            Papers Under Review
          </Link>
          <Link href="/admin/users" className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            Manage Users
          </Link>
          <Link href="/admin/papers?status=pre_proof" className="px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            Awaiting Proof Approval
          </Link>
          <Link href="/admin/papers?status=payment_pending" className="px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            Awaiting Payment
          </Link>
          <Link href="/admin/subjects" className="px-4 py-2 rounded-lg bg-[#0D7C66]/10 text-[#0D7C66] text-sm font-medium hover:bg-[#0D7C66]/20 transition-colors">
            Manage Journals
          </Link>
        </div>
      </div>
    </div>
  );
}
