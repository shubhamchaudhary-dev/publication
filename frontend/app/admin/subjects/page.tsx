'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Subject {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    category?: string;
    status: 'active' | 'coming-soon' | 'archived';
    coverImage?: string;
    issn?: string;
    paperCount?: number;
}

export default function AdminSubjectsPage() {
    const queryClient = useQueryClient();
    
    // Form state
    const [name, setName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<'active' | 'coming-soon' | 'archived'>('active');
    const [coverImage, setCoverImage] = useState('');
    const [issn, setIssn] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data: subjectsData, isLoading } = useQuery<{ data: Subject[] }>({
        queryKey: ['admin', 'subjects'],
        queryFn: async () => {
            const res = await api.get('/api/subjects');
            return res.data;
        },
    });

    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const createMutation = useMutation({
        mutationFn: async (data: Partial<Subject>) => {
            const res = await api.post('/api/subjects', { ...data, slug: generateSlug(data.name || '') });
            return res.data;
        },
        onSuccess: () => {
            resetForm();
            queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
        },
        onError: (err: any) => {
            alert('Error adding journal: ' + (err.response?.data?.message || err.message));
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Partial<Subject> & { _id: string }) => {
            const res = await api.put(`/api/subjects/${data._id}`, { ...data, slug: generateSlug(data.name || '') });
            return res.data;
        },
        onSuccess: () => {
            resetForm();
            queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
        },
        onError: (err: any) => {
            alert('Error updating journal: ' + (err.response?.data?.message || err.message));
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (confirm('Delete journal? Ensure no papers are assigned to it first!')) {
                await api.delete(`/api/subjects/${id}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
        },
        onError: (err: any) => {
            alert('Error deleting journal: ' + (err.response?.data?.message || err.message));
        }
    });

    const resetForm = () => {
        setName('');
        setShortDescription('');
        setCategory('');
        setStatus('active');
        setCoverImage('');
        setIssn('');
        setEditingId(null);
    };

    const handleEdit = (subject: Subject) => {
        setName(subject.name);
        setShortDescription(subject.shortDescription || '');
        setCategory(subject.category || '');
        setStatus(subject.status || 'active');
        setCoverImage(subject.coverImage || '');
        setIssn(subject.issn || '');
        setEditingId(subject._id);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            const data = { name, shortDescription, category, status, coverImage, issn };
            if (editingId) {
                updateMutation.mutate({ _id: editingId, ...data });
            } else {
                createMutation.mutate(data);
            }
        }
    };

    return (
        <div>
            <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-8">Manage Journals</h1>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6 mb-8">
                <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">
                    {editingId ? 'Edit Journal' : 'Add New Journal'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Journal Name (e.g. SwapanJournal of Engineering)"
                            required
                        />
                        <Input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Category (e.g. Engineering & Technology)"
                        />
                        <Input
                            value={issn}
                            onChange={(e) => setIssn(e.target.value)}
                            placeholder="ISSN (e.g. 2583-XXXX)"
                        />
                        <Input
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            placeholder="Short Description"
                        />
                        <div className="flex gap-2 items-center">
                            <Input
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="Logo/Cover Image URL or Upload Image"
                                className="flex-1"
                            />
                            <div className="relative cursor-pointer">
                                <Button type="button" variant="outline" className="cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>Upload</Button>
                                <input 
                                    id="image-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageUpload} 
                                />
                            </div>
                        </div>
                        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="coming-soon">Coming Soon</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                        {editingId && (
                            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                        )}
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || !name.trim()} className="bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                            {editingId ? 'Update Journal' : <><Plus className="w-4 h-4 mr-2" /> Add Journal</>}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F1F5F9] dark:bg-[#1e293b] text-[#475569] dark:text-[#CBD5E1] uppercase text-xs tracking-wider border-b border-[#E2E8F0] dark:border-[#334155]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Journal</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Papers Count</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#374151] text-[#0F172A] dark:text-[#F1F5F9]">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-8">Loading journals...</td></tr>
                            ) : subjectsData?.data?.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">No journals found.</td></tr>
                            ) : (
                                subjectsData?.data?.map(j => (
                                    <tr key={j._id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                                            {j.coverImage && <img src={j.coverImage} className="w-8 h-8 rounded-md object-cover" />}
                                            <div>
                                                <div>{j.name}</div>
                                                <div className="text-xs text-gray-500">{j.slug}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#64748B] dark:text-[#94A3B8]">{j.category}</td>
                                        <td className="px-6 py-4">{j.paperCount || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${j.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : j.status === 'coming-soon' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                {j.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/50"
                                                onClick={() => handleEdit(j)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/50"
                                                onClick={() => deleteMutation.mutate(j._id)}
                                                disabled={j.paperCount !== undefined && j.paperCount > 0}
                                                title={j.paperCount !== undefined && j.paperCount > 0 ? "Cannot delete journal with papers" : "Delete"}
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
