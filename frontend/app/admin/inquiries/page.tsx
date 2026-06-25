'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Inquiry {
    _id: string;
    name: string;
    email: string;
    affiliation?: string;
    inquiryType: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminInquiriesPage() {
    const queryClient = useQueryClient();

    const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
        queryKey: ['admin', 'inquiries'],
        queryFn: async () => {
            const res = await api.get('/api/inquiries');
            return res.data;
        },
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => api.patch(`/api/inquiries/${id}/read`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/api/inquiries/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] }),
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-[#0055A4]" />
                        Contact Inquiries
                    </h1>
                    <p className="text-[#64748B]">Manage messages received from the Contact Us page.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-[#0055A4] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : inquiries?.length === 0 ? (
                <div className="bg-white dark:bg-[#1E293B] p-12 rounded-2xl text-center border border-[#E2E8F0] dark:border-[#334155]">
                    <Mail className="w-16 h-16 mx-auto text-[#CBD5E1] dark:text-[#475569] mb-4" />
                    <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">No Inquiries Found</h3>
                    <p className="text-[#64748B]">You don't have any contact inquiries yet.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A]/50">
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Sender</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Type</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Message</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Date</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                                {inquiries?.map((inquiry) => (
                                    <tr key={inquiry._id} className={`hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 transition-colors ${!inquiry.isRead ? 'bg-blue-50/50 dark:bg-[#0055A4]/10' : ''}`}>
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-3">
                                                {!inquiry.isRead && <div className="w-2 h-2 rounded-full bg-[#0055A4]"></div>}
                                                <div>
                                                    <p className={`font-medium ${!inquiry.isRead ? 'text-[#0F172A] dark:text-[#F1F5F9]' : 'text-[#475569] dark:text-[#94A3B8]'}`}>{inquiry.name}</p>
                                                    <p className="text-sm text-[#64748B]">{inquiry.email}</p>
                                                    {inquiry.affiliation && (
                                                        <p className="text-xs text-[#94A3B8] mt-1">{inquiry.affiliation}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-[#0F172A] text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium uppercase tracking-wider">
                                                {inquiry.inquiryType}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top max-w-md">
                                            <div className="p-4 bg-gray-50 dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                                                <p className="text-sm text-[#475569] dark:text-[#CBD5E1] whitespace-pre-wrap">{inquiry.message}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top text-sm text-[#64748B]">
                                            {new Date(inquiry.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </td>
                                        <td className="p-4 align-top text-right space-x-2">
                                            {!inquiry.isRead && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#0055A4] text-[#0055A4] hover:bg-[#0055A4] hover:text-white"
                                                    onClick={() => markReadMutation.mutate(inquiry._id)}
                                                    disabled={markReadMutation.isPending}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Mark Read
                                                </Button>
                                            )}
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this inquiry?')) {
                                                        deleteMutation.mutate(inquiry._id);
                                                    }
                                                }}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
