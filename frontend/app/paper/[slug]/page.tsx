'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PDFViewer from '@/components/PDFViewer';
import { Paper } from '@/components/PaperCard';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function PaperDetailPage({ params }: { params: { slug: string } }) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [downloading, setDownloading] = useState(false);

    const { data: paperData, isLoading: paperLoading } = useQuery<{ data: { paper: Paper, related: Paper[] } }>({
        queryKey: ['paper', params.slug],
        queryFn: async () => (await api.get(`/api/papers/${params.slug}`)).data,
    });

    const { data: bookmarksData } = useQuery<{ data: { paperId: { _id: string } }[] }>({
        queryKey: ['bookmarks'],
        queryFn: async () => (await api.get('/api/bookmarks')).data,
        enabled: isAuthenticated,
    });

    const paper = paperData?.data?.paper;
    const isBookmarked = isAuthenticated && bookmarksData?.data?.some(b => b.paperId?._id === paper?._id);

    // Only extract the public-facing name from "Name | email | contact | address | designation"
    const getAuthorDisplayNames = (authors: string[]) =>
        authors.map(a => a.split(' | ')[0].trim()).join(', ');

    // Strip the "[Corresponding Email: ...]" prefix added during submission
    // Handles all spacing/newline variations robustly
    const getPublicAbstract = (abstract: string) => {
        return abstract
            .replace(/^\[Corresponding Email:[^\]]*\]\s*/i, '')
            .trim();
    };

    const toggleBookmark = useMutation({
        mutationFn: async () => {
            if (!paper) return;
            if (isBookmarked) {
                await api.delete(`/api/bookmarks/${paper._id}`);
            } else {
                await api.post('/api/bookmarks', { paperId: paper._id });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        }
    });

    const handleBookmark = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        toggleBookmark.mutate();
    };

    const handleDownload = async () => {
        if (!paper) return;
        const downloadUrl = paper.publishedPdfUrl || paper.pdfUrl;
        if (!downloadUrl) return;
        try {
            setDownloading(true);
            const res = await api.post(`/api/papers/${paper._id}/download`);
            window.open(res.data.data.pdfUrl || downloadUrl, '_blank');
            queryClient.invalidateQueries({ queryKey: ['paper', params.slug] });
        } catch (e) {
            console.error(e);
            window.open(downloadUrl, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    if (paperLoading) {
        return (
            <div className="min-h-screen flex flex-col ">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-[#0D7C66] border-t-transparent rounded-full animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!paper) {
        return (
            <div className="min-h-screen flex flex-col ">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex justify-center items-center">
                    <p className="text-[#64748B] dark:text-[#94A3B8]">Paper not found.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col ">
            <Navbar />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
                <header className="mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-[#E86C2C]/10 text-[#E86C2C] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            {typeof paper.subject === 'string' ? "Category" : paper.subject?.name}
                        </span>
                        <span className="text-[#64748B] dark:text-[#94A3B8] text-sm">
                            Published on {paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString() : new Date(paper.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#0F172A] dark:text-[#F1F5F9] leading-tight mb-4">
                        {paper.title}
                    </h1>

                    <p className="text-[#64748B] dark:text-[#94A3B8] text-lg font-medium mb-6">
                        {Array.isArray(paper.authors) ? getAuthorDisplayNames(paper.authors) : 'Unknown Authors'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 border-y border-[#E2E8F0] dark:border-[#1F2937] py-4">
                        <div className="flex items-center gap-6 mr-auto">
                            <div className="text-sm">
                                <span className="block text-xs text-[#64748B] dark:text-[#94A3B8] uppercase">Views</span>
                                <strong className="text-[#0F172A] dark:text-[#F1F5F9]">{paper.views}</strong>
                            </div>
                            <div className="text-sm">
                                <span className="block text-xs text-[#64748B] dark:text-[#94A3B8] uppercase">Downloads</span>
                                <strong className="text-[#0F172A] dark:text-[#F1F5F9]">{paper.downloads}</strong>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleBookmark}
                            className={`border-[#E2E8F0] dark:border-[#374151] hover:bg-[#F1F5F9] dark:hover:bg-[#1F2937] ${isBookmarked ? 'text-[#0D7C66]' : 'text-[#64748B] dark:text-[#94A3B8]'}`}
                        >
                            <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </Button>

                        {paper.publishedPdfUrl && (
                            <Button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="bg-[#0D7C66] hover:bg-[#0a6655] text-white flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" /> {downloading ? 'Processing...' : 'Download PDF'}
                            </Button>
                        )}
                    </div>
                </header>

                <section className="mb-12">
                    <h2 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Abstract</h2>
                    <div className="prose dark:prose-invert max-w-none text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed whitespace-pre-line break-words overflow-hidden">
                        {getPublicAbstract(paper.abstract)}
                    </div>
                </section>

                <section>
                    <h2 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Full Text</h2>
                    {paper.publishedPdfUrl ? (
                        <PDFViewer url={paper.publishedPdfUrl} title={paper.title} />
                    ) : (
                        <div className="bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-xl p-8 text-center">
                            <p className="text-[#64748B] dark:text-[#94A3B8]">The formatted PDF for this paper has not yet been uploaded by the editorial team.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
