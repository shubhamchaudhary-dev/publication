'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, Download, User, BookOpen, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="text-center p-12 text-[#64748B]">Loading PDF Viewer...</div>
});
import { Paper } from '@/components/PaperCard';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function PaperDetailPage({ params }: { params: { slug: string } }) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [downloading, setDownloading] = useState(false);

    // Copy protection: block copy event and Ctrl+C / Ctrl+A shortcuts
    useEffect(() => {
        const blockCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            e.clipboardData?.setData('text/plain', '');
        };
        const blockKeyShortcuts = (e: KeyboardEvent) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
            }
        };
        document.addEventListener('copy', blockCopy);
        document.addEventListener('keydown', blockKeyShortcuts);
        return () => {
            document.removeEventListener('copy', blockCopy);
            document.removeEventListener('keydown', blockKeyShortcuts);
        };
    }, []);

    const { data: paperData, isLoading: paperLoading } = useQuery<{ data: { paper: Paper, related: Paper[], isLocked?: boolean } }>({
        queryKey: ['paper', params.slug],
        queryFn: async () => (await api.get(`/api/papers/${params.slug}`)).data,
    });

    const { data: bookmarksData } = useQuery<{ data: { paperId: { _id: string } }[] }>({
        queryKey: ['bookmarks'],
        queryFn: async () => (await api.get('/api/bookmarks')).data,
        enabled: isAuthenticated,
    });

    const paper = paperData?.data?.paper;
    const isLocked = !!paperData?.data?.isLocked;
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
        const publishedUrl = paper.publishedPdfUrl;
        if (!publishedUrl) return;
        try {
            setDownloading(true);
            await api.post(`/api/papers/${paper._id}/download`);
            queryClient.invalidateQueries({ queryKey: ['paper', params.slug] });
        } catch (e) {
            console.error('Download tracking failed (non-blocking):', e);
        } finally {
            setDownloading(false);
        }

        try {
            const res = await fetch(publishedUrl);
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${paper.slug}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            window.open(publishedUrl, '_blank');
        }
    };

    if (paperLoading) {
        return (
            <div className="min-h-screen flex flex-col ">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex justify-center items-center">
                    <div className="w-12 h-12 border-4 border-[#0D7C66] border-t-transparent rounded-full animate-spin"></div>
                </main>
                
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
                
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white paper-reader-protected">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
                {/* Left Column */}
                <div className="flex-1 w-full max-w-4xl">
                    <span className="inline-block bg-[#E6F3FF] text-[#0077b5] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-4">
                        Article
                    </span>
                    
                    <h1 className="font-serif text-xl sm:text-2xl leading-tight font-bold text-[#0F172A] mb-6">
                        {paper.title}
                    </h1>

                    {/* Authors */}
                    <div className="flex items-center gap-2 text-[#475569] mb-4">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {Array.isArray(paper.authors) ? getAuthorDisplayNames(paper.authors) : 'Unknown Authors'}
                        </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] mb-8 border-b border-[#E2E8F0] pb-6">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            <span>Swapan Journal</span>
                        </div>
                        <span className="text-[#CBD5E1]">|</span>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Volume {new Date(paper.createdAt).getFullYear()}</span>
                        </div>
                        <span className="text-[#CBD5E1]">|</span>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(paper.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Abstract */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-[#0F172A] mb-4">Abstract</h3>
                        <div className="text-[#334155] text-[15px] leading-relaxed whitespace-pre-line text-justify">
                            {getPublicAbstract(paper.abstract)}
                        </div>
                    </div>

                    {/* Keywords (if any) */}
                    {paper.keywords && paper.keywords.length > 0 && (
                        <div className="mb-8 text-sm text-justify">
                            <span className="font-bold text-[#0F172A]">Keywords: </span>
                            <span className="text-[#475569]">{paper.keywords.join(', ')}</span>
                        </div>
                    )}
                    
                    <div className="border-b border-[#E2E8F0] mb-8"></div>

                    {/* Author Affiliations */}
                    {Array.isArray(paper.authors) && paper.authors.length > 0 && (
                        <div className="mb-12">
                            <h3 className="font-serif text-xl font-bold text-[#1e3a8a] mb-6">Author Affiliations</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {paper.authors.map((authorStr, idx) => {
                                    const parts = authorStr.split(' | ').map(p => p.trim());
                                    const name = parts[0] || 'Unknown Author';
                                    const designation = parts[4] || '';
                                    const affiliation = designation;
                                    
                                    return (
                                        <div key={idx} className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0]">
                                            <h4 className="font-bold text-[#0F172A] mb-2">{name}</h4>
                                            <p className="text-sm text-[#475569] leading-relaxed">
                                                {affiliation || "Affiliation not provided."}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Full Paper Section */}
                    <div className="mb-12">
                        <h3 className="font-serif text-xl font-bold text-[#1e3a8a] mb-6">Full Paper</h3>
                        <div className="w-full border border-[#E2E8F0] rounded-xl overflow-hidden bg-white h-[800px] relative shadow-sm">
                            {paper.publishedPdfUrl ? (
                                <>
                                    <div className={`w-full h-full ${isLocked ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>
                                        <PDFViewer url={paper.publishedPdfUrl} title={paper.title} />
                                    </div>
                                    {isLocked && (
                                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-8 text-center">
                                            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center">
                                                <div className="w-16 h-16 bg-[#E6F3FF] text-[#0077b5] rounded-full flex items-center justify-center mb-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                    </svg>
                                                </div>
                                                <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Premium Content</h2>
                                                <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
                                                    This paper is locked and requires an active membership to view the full text and download the PDF.
                                                </p>
                                                <Button
                                                    onClick={() => router.push('/membership')}
                                                    className="w-full h-12 bg-[#0077b5] hover:bg-[#005e8e] text-white font-bold text-sm rounded-lg transition-colors"
                                                >
                                                    Unlock with Membership
                                                </Button>
                                                {!isAuthenticated && (
                                                    <p className="mt-4 text-xs text-[#64748B]">
                                                        Already a member? <a href="/login" className="text-[#0077b5] hover:underline">Log in</a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-center p-8 bg-[#F8FAFC]">
                                    <p className="text-[#64748B]">The formatted PDF for this paper has not yet been uploaded.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0">
                    <div className="sticky top-24 flex flex-col gap-6">
                        {/* Illustration */}
                        <div className="w-full flex justify-center py-4">
                            <svg className="w-40 h-auto drop-shadow-sm opacity-90" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Base Document */}
                                <rect x="40" y="10" width="120" height="140" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                                
                                {/* Header Block */}
                                <rect x="56" y="28" width="88" height="6" rx="3" fill="#0284C7" />
                                
                                {/* Lines of Text */}
                                <rect x="56" y="44" width="60" height="4" rx="2" fill="#E2E8F0" />
                                <rect x="56" y="54" width="76" height="4" rx="2" fill="#E2E8F0" />
                                <rect x="56" y="64" width="48" height="4" rx="2" fill="#E2E8F0" />
                                
                                {/* Left Chart (Bar Chart) */}
                                <rect x="56" y="86" width="36" height="40" rx="4" fill="#F8FAFC" />
                                <rect x="62" y="106" width="6" height="16" rx="1" fill="#3B82F6" />
                                <rect x="71" y="96" width="6" height="26" rx="1" fill="#60A5FA" />
                                <rect x="80" y="112" width="6" height="10" rx="1" fill="#93C5FD" />
                                
                                {/* Right Chart (Pie Chart) */}
                                <circle cx="124" cy="106" r="20" fill="#E0F2FE" />
                                <path d="M124 86 A20 20 0 0 1 144 106 L124 106 Z" fill="#3B82F6" />
                                <path d="M104 106 A20 20 0 0 0 124 126 L124 106 Z" fill="#0284C7" />
                            </svg>
                        </div>

                        {/* Download Card */}
                        <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
                            <h3 className="font-bold text-[#0F172A] text-base mb-3">Download Paper</h3>
                            <Button
                                onClick={handleDownload}
                                disabled={downloading || isLocked || !paper.publishedPdfUrl}
                                className="w-full bg-[#1a365d] hover:bg-[#152c6e] text-white h-10 rounded-lg flex items-center justify-center gap-2 mb-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                            >
                                <Download className="w-4 h-4" />
                                {downloading ? 'Downloading...' : 'Download PDF'}
                            </Button>
                            <p className="text-[11px] text-[#64748B] text-center">
                                {isLocked ? 'Membership required to download.' : !paper.publishedPdfUrl ? 'PDF not available.' : 'Access the full paper in PDF format.'}
                            </p>
                        </div>
                        
                        {/* Bookmark Button */}
                        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                             <Button
                                onClick={handleBookmark}
                                variant="outline"
                                className={`w-full h-11 flex items-center justify-center gap-2 rounded-lg border-[#E2E8F0] ${isBookmarked ? 'text-[#0077b5] bg-[#E6F3FF] border-[#BAE6FD]' : 'text-[#475569] hover:bg-[#F8FAFC]'}`}
                            >
                                <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                {isBookmarked ? 'Saved to Library' : 'Save to Library'}
                            </Button>
                        </div>
                    </div>
                </aside>
            </main>
            
            

            <style jsx global>{`
                /* Copy protection */
                .paper-reader-protected {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
                .paper-reader-protected ::selection {
                    background: transparent;
                }
            `}</style>
        </div>
    );
}
