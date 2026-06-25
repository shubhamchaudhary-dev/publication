'use client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Search } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaperCard, { Paper } from '@/components/PaperCard';
import SkeletonCard from '@/components/SkeletonCard';
import SearchBar from '@/components/SearchBar';

interface PapersResponse {
    data: Paper[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const subjectStr = searchParams.get('subject') || '';

    const { data: papersData, isLoading: papersLoading } = useQuery<PapersResponse>({
        queryKey: ['papers', 'search', q, subjectStr],
        queryFn: async () => {
            const url = new URL('/api/papers', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
            if (q) url.searchParams.set('q', q);
            if (subjectStr && subjectStr !== 'all') url.searchParams.set('subject', subjectStr);
            url.searchParams.set('limit', '50'); // simple large limit for MVP search
            return (await api.get(url.pathname + url.search)).data;
        },
        enabled: !!q || !!subjectStr,
    });

    const papers = papersData?.data || [];

    return (
        <div className="min-h-screen flex flex-col ">
            <Navbar />

            <div className="bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1F2937] px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-6">
                        Search Results
                    </h1>
                    <div className="max-w-2xl mx-auto">
                        <SearchBar large />
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
                {(!q && !subjectStr) ? (
                    <div className="text-center py-20">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#64748B]" />
                        <p className="text-[#64748B] dark:text-[#94A3B8]">Enter a search term to find papers.</p>
                    </div>
                ) : papers.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-xl border border-[#E2E8F0] dark:border-[#1F2937]">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#64748B]" />
                        <p className="text-[#64748B] dark:text-[#94A3B8]">No papers found matching "{q}".</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-[#64748B] dark:text-[#94A3B8] mb-6 font-medium">Found {papersData?.pagination.total} result{papersData?.pagination.total !== 1 ? 's' : ''}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {papers.map((paper) => (
                                <PaperCard key={paper._id} paper={paper} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
