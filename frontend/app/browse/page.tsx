'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaperCard, { Paper } from '@/components/PaperCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Button } from '@/components/ui/button';

interface Subject {
    _id: string;
    name: string;
    slug: string;
    paperCount: number;
}

interface PapersResponse {
    data: Paper[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const subjectSlug = searchParams.get('subject') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    const { data: subjectsData } = useQuery<Subject[]>({
        queryKey: ['subjects'],
        queryFn: async () => (await api.get('/api/subjects')).data.data,
    });

    const { data: papersData, isLoading: papersLoading } = useQuery<PapersResponse>({
        queryKey: ['papers', 'browse', subjectSlug, pageParam],
        queryFn: async () => {
            const url = new URL('/api/papers', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
            url.searchParams.set('limit', '12');
            url.searchParams.set('page', pageParam.toString());
            if (subjectSlug) url.searchParams.set('subject', subjectSlug);
            return (await api.get(url.pathname + url.search)).data;
        },
    });

    const subjects = subjectsData || [];
    const papers = papersData?.data || [];
    const pagination = papersData?.pagination;

    const handleSubjectClick = (id: string) => {
        if (subjectSlug === id) {
            router.push('/browse');
        } else {
            router.push(`/browse?subject=${id}`);
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/browse?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col ">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">

                {/* Left Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-[#111827] rounded-xl p-5 border border-[#E2E8F0] dark:border-[#1F2937] sticky top-24">
                        <h2 className="font-serif font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4">Subjects</h2>
                        {subjectSlug && (
                            <button
                                onClick={() => router.push('/browse')}
                                className="text-sm text-[#0D7C66] hover:underline mb-3 block"
                            >
                                Clear filter
                            </button>
                        )}
                        <div className="space-y-2">
                            {subjects.map(s => (
                                <button
                                    key={s._id}
                                    onClick={() => handleSubjectClick(s._id)}
                                    className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${subjectSlug === s._id ? 'bg-[#0D7C66]/10 text-[#0D7C66] font-medium' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1F2937]'}`}
                                >
                                    {s.name} <span className="text-xs opacity-70 ml-1">({s.paperCount})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-6">
                        {subjectSlug && subjects.find(s => s._id === subjectSlug)
                            ? `Browse: ${subjects.find(s => s._id === subjectSlug)?.name}`
                            : 'All Papers'}
                    </h1>

                    {papersLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : papers.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-xl border border-[#E2E8F0] dark:border-[#1F2937]">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#64748B]" />
                            <p className="text-[#64748B] dark:text-[#94A3B8]">No papers found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {papers.map((paper) => (
                                    <PaperCard key={paper._id} paper={paper} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={pagination.page === 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center text-sm font-medium px-4">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={pagination.page === pagination.totalPages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}
