'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Megaphone, Trash2, Download } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Subscriber {
    _id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminSubscribersPage() {
    const queryClient = useQueryClient();

    const { data: subscribers, isLoading } = useQuery<Subscriber[]>({
        queryKey: ['admin', 'subscribers'],
        queryFn: async () => {
            const res = await api.get('/api/subscribers');
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/api/subscribers/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'subscribers'] }),
    });

    const exportToCSV = () => {
        if (!subscribers || subscribers.length === 0) return;
        
        const headers = ['Email', 'Status', 'Subscribed At'];
        const csvRows = [headers.join(',')];
        
        subscribers.forEach(sub => {
            const date = new Date(sub.createdAt).toLocaleString('en-US');
            const status = sub.isActive ? 'Active' : 'Unsubscribed';
            csvRows.push(`${sub.email},${status},"${date}"`);
        });
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2 flex items-center gap-3">
                        <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-[#0055A4] shrink-0" />
                        <span className="break-words">Newsletter Subscribers</span>
                    </h1>
                    <p className="text-[#64748B] text-sm sm:text-base">Manage your mailing list for research updates and announcements.</p>
                </div>
                <Button 
                    onClick={exportToCSV}
                    disabled={!subscribers || subscribers.length === 0}
                    className="bg-[#0055A4] hover:bg-[#004080] text-white shrink-0"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-[#0055A4] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : subscribers?.length === 0 ? (
                <div className="bg-white dark:bg-[#1E293B] p-12 rounded-2xl text-center border border-[#E2E8F0] dark:border-[#334155]">
                    <Megaphone className="w-16 h-16 mx-auto text-[#CBD5E1] dark:text-[#475569] mb-4" />
                    <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">No Subscribers Yet</h3>
                    <p className="text-[#64748B]">When users subscribe to your newsletter, they will appear here.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A]/50">
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Email Address</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Status</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8]">Subscribed Date</th>
                                    <th className="p-4 font-semibold text-[#475569] dark:text-[#94A3B8] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                                {subscribers?.map((subscriber) => (
                                    <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{subscriber.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                                                subscriber.isActive 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-[#64748B]">
                                            {new Date(subscriber.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this subscriber?')) {
                                                        deleteMutation.mutate(subscriber._id);
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
