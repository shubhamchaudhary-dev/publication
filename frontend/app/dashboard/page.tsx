'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { BookOpen, User as UserIcon, LogOut, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaperCard, { Paper } from '@/components/PaperCard';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'papers' | 'bookmarks' | 'profile'>('bookmarks');
    const [showSuccess, setShowSuccess] = useState(false);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: user?.name || '',
            institution: user?.institution || '',
        }
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('tab') === 'papers') {
                setActiveTab('papers');
            } else if (user?.role === 'researcher') {
                setActiveTab('papers');
            }
            if (params.get('success') === 'true') {
                setShowSuccess(true);
                // Clear the query params after a few seconds or instantly
                window.history.replaceState({}, '', '/dashboard');
                setTimeout(() => setShowSuccess(false), 5000);
            }
        }
        if (user) {
            reset({ name: user.name, institution: user.institution || '' });
        }
    }, [user, reset]);

    const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery<{ data: { paperId: Paper }[] }>({
        queryKey: ['bookmarks'],
        queryFn: async () => (await api.get('/api/bookmarks')).data,
        enabled: isAuthenticated,
    });

    const { data: myPapersData, isLoading: papersLoading } = useQuery<{ data: Paper[] }>({
        queryKey: ['papers', 'me'],
        queryFn: async () => (await api.get('/api/papers/me')).data,
        enabled: isAuthenticated && !!user,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { name: string; institution: string }) => {
            await api.put('/api/users/me', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            // We could ideally trigger fetchMe here
            window.location.reload();
        }
    });

    const deletePaperMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/papers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers', 'me'] });
        }
    });

    if (authLoading || !isAuthenticated) return null;

    return (
        <div className="min-h-screen flex flex-col ">
            <Navbar />

            <div className="flex-1 w-[90%] max-w-7xl mx-auto py-10 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] overflow-hidden">
                        <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1F2937] text-center">
                            <div className="w-20 h-20 bg-[#0D7C66] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">{user?.name}</h2>
                            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{user?.email}</p>
                            <div className="mt-2 inline-block bg-[#E2E8F0] dark:bg-[#374151] px-2 py-1 rounded text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase">
                                {user?.role}
                            </div>
                        </div>
                        <nav className="p-2">
                            <button
                                onClick={() => setActiveTab('papers')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === 'papers' ? 'bg-[#0D7C66]/10 text-[#0D7C66]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1F2937]'}`}
                            >
                                <BookOpen className="inline w-4 h-4 mr-2" /> My Papers
                            </button>
                            <button
                                onClick={() => setActiveTab('bookmarks')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === 'bookmarks' ? 'bg-[#0D7C66]/10 text-[#0D7C66]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1F2937]'}`}
                            >
                                <BookOpen className="inline w-4 h-4 mr-2" /> Bookmarks
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === 'profile' ? 'bg-[#0D7C66]/10 text-[#0D7C66]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1F2937]'}`}
                            >
                                <UserIcon className="inline w-4 h-4 mr-2" /> Profile Settings
                            </button>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
                            >
                                <LogOut className="inline w-4 h-4 mr-2" /> Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 bg-white dark:bg-[#111827] rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] p-6 md:p-8">

                    {activeTab === 'papers' && (
                        <div>
                            {showSuccess && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-lg flex items-center shadow-sm">
                                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span><strong>Success!</strong> Your manuscript has been submitted successfully and is now publicly available.</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">My Papers</h2>
                                <Button onClick={() => router.push('/submit')} className="bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                                    Submit New
                                </Button>
                            </div>
                            {papersLoading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-32 bg-[#F1F5F9] dark:bg-[#1F2937] animate-pulse rounded-lg" />)}
                                </div>
                            ) : myPapersData?.data.length === 0 ? (
                                <div className="text-center py-12 text-[#64748B] dark:text-[#94A3B8]">
                                    <p>You haven't submitted any papers yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myPapersData?.data.map((paper: Paper) => (
                                        <div key={paper._id} className="border border-[#E2E8F0] dark:border-[#374151] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                <h3 className="font-serif font-bold text-[#0F172A] dark:text-[#F1F5F9] text-lg break-words">{paper.title}</h3>
                                                <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 mb-2">
                                                    Status: <span className={`uppercase font-semibold px-2 py-0.5 rounded text-xs ${
                                                        paper.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                                        paper.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                        paper.status === 'under_review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                                                    }`}>{paper.status.replace('_', ' ')}</span>
                                                </div>
                                                {paper.remarks && (
                                                    <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300 p-3 rounded-lg border border-gray-200 dark:border-gray-700 break-words">
                                                        <strong>Editorial Remark:</strong> {paper.remarks}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 shrink-0 flex-wrap self-start">
                                                {/* Download original submitted Word file */}
                                                {paper.pdfUrl && (
                                                    <a
                                                        href={paper.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                                    >
                                                        ↓ My Submission
                                                    </a>
                                                )}
                                                {paper.status === 'submitted' && (
                                                    <>
                                                        <Button variant="outline" size="sm" onClick={() => router.push(`/submit?edit=${paper._id}`)}>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => {
                                                            if (confirm('Withdraw this submission?')) deletePaperMutation.mutate(paper._id);
                                                        }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'bookmarks' && (
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-6">Saved Bookmarks</h2>
                            {bookmarksLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2].map(i => <div key={i} className="h-48 bg-[#F1F5F9] dark:bg-[#1F2937] animate-pulse rounded-lg" />)}
                                </div>
                            ) : bookmarksData?.data.length === 0 ? (
                                <div className="text-center py-12 text-[#64748B] dark:text-[#94A3B8]">
                                    <p>You have no saved papers.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {bookmarksData?.data.map((b) => (
                                        <PaperCard key={b.paperId._id} paper={b.paperId} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-6">Profile Settings</h2>
                            <form onSubmit={handleSubmit((d) => updateProfileMutation.mutate(d as any))} className="max-w-md space-y-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input disabled value={user?.email} className="bg-gradient-to-br from-[#FFFBEA]/50 to-[#FFFFFF] dark:bg-[#1F2937]" />
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Email cannot be changed.</p>
                                </div>
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" {...register('name')} />
                                </div>
                                <div>
                                    <Label htmlFor="institution">Institution</Label>
                                    <Input id="institution" {...register('institution')} placeholder="University or Company" />
                                </div>
                                <Button type="submit" disabled={updateProfileMutation.isPending} className="bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                                {updateProfileMutation.isSuccess && <p className="text-green-600 text-sm mt-2">Profile updated successfully.</p>}
                            </form>
                        </div>
                    )}

                </main>
            </div>

            <Footer />
        </div>
    );
}
