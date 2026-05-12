'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Subject {
    _id: string;
    name: string;
    slug: string;
    paperCount: number;
}

export default function AdminSubjectsPage() {
    const queryClient = useQueryClient();
    const [newSubject, setNewSubject] = useState('');

    const { data: subjectsData, isLoading } = useQuery<{ data: Subject[] }>({
        queryKey: ['admin', 'subjects'],
        queryFn: async () => {
            // The public endpoint is /api/subjects and has everything we need
            const res = await api.get('/api/subjects');
            return res.data;
        },
    });

    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            await api.post('/api/subjects', { name, slug: generateSlug(name) });
        },
        onSuccess: () => {
            setNewSubject('');
            queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/subjects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
        }
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubject.trim()) {
            createMutation.mutate(newSubject.trim());
        }
    };

    return (
        <div>
            <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-8">Manage Subjects</h1>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6 mb-8">
                <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Add New Subject</h2>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <Input
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="flex-1"
                    />
                    <Button type="submit" disabled={createMutation.isPending || !newSubject.trim()} className="bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </form>
            </div>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F1F5F9] dark:bg-[#1e293b] text-[#475569] dark:text-[#CBD5E1] uppercase text-xs tracking-wider border-b border-[#E2E8F0] dark:border-[#334155]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Slug</th>
                                <th className="px-6 py-4 font-semibold">Papers Count</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#374151] text-[#0F172A] dark:text-[#F1F5F9]">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-8">Loading subjects...</td></tr>
                            ) : subjectsData?.data?.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">No subjects found.</td></tr>
                            ) : (
                                subjectsData?.data?.map(s => (
                                    <tr key={s._id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors">
                                        <td className="px-6 py-4 font-medium">{s.name}</td>
                                        <td className="px-6 py-4 text-[#64748B] dark:text-[#94A3B8]">{s.slug}</td>
                                        <td className="px-6 py-4">{s.paperCount || 0}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => { if (confirm('Delete subject? Ensure no papers are assigned to it first!')) deleteMutation.mutate(s._id); }}
                                                className="p-2"
                                                disabled={s.paperCount > 0}
                                                title={s.paperCount > 0 ? "Cannot delete subject with papers" : "Delete"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
