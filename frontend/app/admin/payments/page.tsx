'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Payment {
    _id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'success' | 'failed';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: string;
    paidAt?: string;
    authorId?: { name: string; email: string };
    paperId?: { title: string };
}

export default function AdminPaymentsPage() {
    const { data: paymentsData, isLoading } = useQuery({
        queryKey: ['admin', 'payments'],
        queryFn: async () => {
            const res = await api.get('/api/admin/payments');
            return res.data;
        },
    });

    const payments: Payment[] = paymentsData?.data || [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Payments</h1>
                <p className="text-[#64748B] dark:text-[#94A3B8] mt-2">View all Razorpay publication fee transactions.</p>
            </div>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F1F5F9] dark:bg-[#1e293b] text-[#475569] dark:text-[#CBD5E1] uppercase text-xs tracking-wider border-b border-[#E2E8F0] dark:border-[#334155]">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-[25%]">Transaction ID</th>
                                <th className="px-6 py-4 font-semibold w-[20%]">Author</th>
                                <th className="px-6 py-4 font-semibold w-[25%]">Paper Title</th>
                                <th className="px-6 py-4 font-semibold w-[10%]">Amount</th>
                                <th className="px-6 py-4 font-semibold w-[10%]">Status</th>
                                <th className="px-6 py-4 font-semibold w-[10%]">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#374151] text-[#0F172A] dark:text-[#F1F5F9]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
                                            Loading payments...
                                        </div>
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                                                <span className="font-mono text-xs">{payment.razorpayPaymentId || payment.razorpayOrderId || payment._id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{payment.authorId?.name || 'Unknown'}</p>
                                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{payment.authorId?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="line-clamp-2" title={payment.paperId?.title}>
                                                {payment.paperId?.title || 'Unknown Paper'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                                            {payment.currency} {payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                                ${payment.status === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                  payment.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {payment.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {payment.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                                {payment.status === 'failed' && <XCircle className="w-3.5 h-3.5" />}
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}
                                            <br />
                                            <span className="text-[#64748B] dark:text-[#94A3B8]">
                                                {new Date(payment.paidAt || payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
