'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ChevronDown, ArrowRight, FileText, Award, Calendar, Hash, Clock, Eye, Download } from 'lucide-react';
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
    issn?: string;
    paperCount: number;
}

interface PapersResponse {
    data: Paper[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
}

// Static journal data — add per-journal content here
// NOTE: gradient uses real CSS linear-gradient() strings, NOT Tailwind classes
// (dynamic Tailwind classes get purged at build time)
const JOURNAL_DATA: Record<string, {
    title: string;
    tagline: string;
    description: string;
    scope?: string[];
    gradient: string;  // CSS linear-gradient() value
    bannerImage?: string; // Optional background image for the detail page header
    coverImage?: string; // Optional cover thumbnail image for the journal list
    eicName?: string;
    eicTitle?: string;
    eicPhoto?: string;
    discipline?: string;
    frequency?: string;
    issn?: string;
    established?: string;
}> = {
    'samanvay': {
        title: 'Samanvay Journal',
        tagline: 'A Multidisciplinary Journal in Social Sciences & Humanities',
        gradient: 'linear-gradient(135deg, #4a1a5c, #7b2d9e)',
        bannerImage: '/images/samnaybanner.png',
        description: 'Samanvay Journal is a multidisciplinary journal in the field of Social Sciences and Humanities dedicated to promoting high-quality academic research and scholarly dialogue. The journal primarily emphasizes quantitative social science research and methodological advancements while also encouraging diverse theoretical and interdisciplinary contributions.\n\nThe journal aims to provide a platform for researchers, academicians, professionals, and scholars to publish original and innovative work addressing contemporary social issues and emerging challenges in society. It seeks to foster critical understanding, evidence-based analysis, and the development of new perspectives across various disciplines within the social sciences and humanities.\n\nThe journal strongly encourages multi- and inter-disciplinary research that bridges traditional academic boundaries and contributes to broader intellectual and societal development. Through rigorous peer review and academic standards, Samanvay Journal strives to support meaningful research that advances knowledge in Social Sciences and Humanities.',
        scope: [
            'Quantitative social science research and statistical methodologies',
            'Empirical and evidence-based studies',
            'Theoretical and conceptual research articles',
            'Case studies addressing social, cultural, economic, educational, and political issues',
            'Methodological and analytical research papers',
            'Systematic literature reviews and review articles',
            'Interdisciplinary and multidisciplinary research contributions',
            'Innovative, experimental, and emerging research approaches',
            'Replication studies and validation research',
            'Studies reporting negative or non-significant findings that contribute to scholarly transparency and academic integrity',
        ],
        eicName: 'Editor-in-Chief',
        eicTitle: 'Samanvay Journal',
        eicPhoto: '/images/avatars/samanway.jpg',
        coverImage: '/images/avatars/samanwaybook.jpg',
        discipline: 'Social Sciences & Humanities',
        frequency: 'Bi-Annual',
        issn: '2583-XXXX',
        established: '2026',
    },
    'samanvay journal': {
        title: 'Samanvay Journal',
        tagline: 'A Multidisciplinary Journal in Social Sciences & Humanities',
        gradient: 'linear-gradient(135deg, #4a1a5c, #7b2d9e)',
        bannerImage: '/images/samnaybanner.png',
        description: 'Samanvay Journal is a multidisciplinary journal in the field of Social Sciences and Humanities dedicated to promoting high-quality academic research and scholarly dialogue. The journal primarily emphasizes quantitative social science research and methodological advancements while also encouraging diverse theoretical and interdisciplinary contributions.\n\nThe journal aims to provide a platform for researchers, academicians, professionals, and scholars to publish original and innovative work addressing contemporary social issues and emerging challenges in society. It seeks to foster critical understanding, evidence-based analysis, and the development of new perspectives across various disciplines within the social sciences and humanities.\n\nThe journal strongly encourages multi- and inter-disciplinary research that bridges traditional academic boundaries and contributes to broader intellectual and societal development. Through rigorous peer review and academic standards, Samanvay Journal strives to support meaningful research that advances knowledge in Social Sciences and Humanities.',
        scope: [
            'Quantitative social science research and statistical methodologies',
            'Empirical and evidence-based studies',
            'Theoretical and conceptual research articles',
            'Case studies addressing social, cultural, economic, educational, and political issues',
            'Methodological and analytical research papers',
            'Systematic literature reviews and review articles',
            'Interdisciplinary and multidisciplinary research contributions',
            'Innovative, experimental, and emerging research approaches',
            'Replication studies and validation research',
            'Studies reporting negative or non-significant findings that contribute to scholarly transparency and academic integrity',
        ],
        eicName: 'Editor-in-Chief',
        eicTitle: 'Samanvay Journal',
        eicPhoto: '/images/avatars/samanway.jpg',
        coverImage: '/images/avatars/samanwaybook.jpg',
        discipline: 'Social Sciences & Humanities',
        frequency: 'Bi-Annual',
        issn: '2583-XXXX',
        established: '2026',
    },
    'computer science': {
        title: 'Swapan Computer Science Journal',
        tagline: 'Advancing Computing Research & Innovation',
        gradient: 'linear-gradient(135deg, #1a3a5c, #0077b5)',
        description: 'A peer-reviewed academic journal publishing original research contributions in computer science, software engineering, artificial intelligence, and emerging technologies. This journal welcomes high-quality submissions from researchers and practitioners worldwide.',
    },
    'mathematics': {
        title: 'Swapan Mathematics Journal',
        tagline: 'Pure & Applied Mathematical Research',
        gradient: 'linear-gradient(135deg, #2d1a5c, #7b2fbf)',
        description: 'A peer-reviewed journal dedicated to advancing knowledge in pure and applied mathematics. We publish original research articles, reviews, and surveys covering a broad spectrum of mathematical sciences.',
    },
    'physics': {
        title: 'Swapan Physics Journal',
        tagline: 'Frontiers of Physical Sciences',
        gradient: 'linear-gradient(135deg, #1a3a2d, #0d7c66)',
        description: 'A peer-reviewed journal publishing cutting-edge research across all areas of physics, including theoretical, experimental, and computational approaches.',
    },
    'economics': {
        title: 'Swapan Economics Journal',
        tagline: 'Economic Theory, Policy & Analysis',
        gradient: 'linear-gradient(135deg, #5c2d1a, #c05a1f)',
        description: 'A peer-reviewed journal dedicated to economic research, policy analysis, and empirical studies across micro and macroeconomic domains.',
    },
};

const DEFAULT_JOURNAL = {
    title: '',
    tagline: 'An Open-Access Peer-Reviewed Academic Journal',
    gradient: 'linear-gradient(135deg, #1a2a3c, #2d4a6e)',
    description: 'A peer-reviewed academic journal publishing original research contributions advancing the frontiers of knowledge. This journal welcomes high-quality submissions from researchers worldwide.',
    discipline: 'Multidisciplinary',
    frequency: 'Bi-Annual',
    issn: 'XXXX-XXXX',
    established: '2022',
};

// CSS gradient per journal name for the listing page cover thumbnails
const COVER_GRADIENTS: Record<string, string> = {
    'samanvay': 'linear-gradient(135deg, #4a1a5c, #7b2d9e)',
    'samanvay journal': 'linear-gradient(135deg, #4a1a5c, #7b2d9e)',
    'computer science': 'linear-gradient(135deg, #1a3a5c, #0077b5)',
    'mathematics': 'linear-gradient(135deg, #2d1a5c, #7b2fbf)',
    'physics': 'linear-gradient(135deg, #1a3a2d, #0d7c66)',
    'economics': 'linear-gradient(135deg, #5c2d1a, #c05a1f)',
    default: 'linear-gradient(135deg, #1a2a3c, #2d4a6e)',
};

// Legacy compat (unused, kept to avoid import errors)
const JOURNAL_DESCRIPTIONS: Record<string, string> = {};
const JOURNAL_COLORS: Record<string, string> = {};

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const subjectSlug = searchParams.get('subject') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
        enabled: !!subjectSlug, // Only fetch papers when a journal is selected
    });

    const subjects = subjectsData || [];
    const papers = papersData?.data || [];
    const pagination = papersData?.pagination;
    const selectedJournal = subjects.find(s => s._id === subjectSlug || s.slug === subjectSlug);
    const journalKey = selectedJournal?.name?.toLowerCase() || 'default';
    const journalData = JOURNAL_DATA[journalKey] || DEFAULT_JOURNAL;
    const gradientClass = journalData.gradient;
    // Smart title: use explicit title from JOURNAL_DATA, otherwise build one without doubling 'Journal'
    const journalTitle = journalData.title || (
        selectedJournal?.name?.toLowerCase().endsWith('journal')
            ? selectedJournal.name
            : `Swapan ${selectedJournal?.name} Journal`
    );
    const journalDesc = journalData.description;

    const handleJournalSelect = (id: string) => {
        setDropdownOpen(false);
        router.push(`/browse?subject=${id}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/browse?${params.toString()}`);
    };

    // ——— JOURNAL LISTING STATE (no journal selected) ———
    if (!subjectSlug) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                
                {/* Hero Banner - Same size as before (zoom 0.80) */}
                <div
                    className="py-8 px-6 relative"
                    style={{
                        backgroundImage: 'linear-gradient(to right, rgba(10,20,40,0.45) 0%, rgba(10,20,40,0.25) 100%), url(/images/banner.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderBottom: '1px solid #243f60',
                        zoom: 0.80,
                    }}
                >
                    <div className="max-w-5xl mx-auto">
                        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2 !text-white">Swapan Journals</h1>
                        <p className="text-sm mb-6 max-w-2xl" style={{ color: 'rgba(200,220,240,0.9)' }}>
                            Discover peer-reviewed research across disciplines. Select a journal to explore articles, abstracts, and full-text publications.
                        </p>
                        {/* Dropdown */}
                        <div className="relative max-w-md">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full flex items-center justify-between bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-4 py-3 text-sm font-medium transition-colors shadow-sm"
                            >
                                <span>Select a Journal...</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                    {subjects.map(s => (
                                        <button
                                            key={s._id}
                                            onClick={() => handleJournalSelect(s._id)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex justify-between items-center border-b border-gray-100 last:border-0"
                                        >
                                            <span>{s.name}</span>
                                            <span className="text-blue-500 text-xs">{s.paperCount} papers</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content - slightly zoomed in */}
                <div style={{ zoom: 0.90 }} className="flex-1 flex flex-col w-full">

                {/* Breadcrumb */}
                <div className="max-w-5xl mx-auto w-full px-4 pt-4 pb-1">
                    <nav className="flex items-center gap-1 text-[13px] text-[#64748B] dark:text-[#94A3B8]">
                        <a href="/" className="hover:text-[#1e3a8a] hover:underline transition-colors">Home</a>
                        <span className="mx-1 text-[#94A3B8]">›</span>
                        <span className="text-[#1e3a8a] dark:text-[#60a5fa] font-semibold italic">Swapan Journals</span>
                    </nav>
                </div>

                {/* About Swapan Journals */}
                <div className="max-w-5xl mx-auto w-full px-4 py-6">
                    <div className="border border-[#e2e8f0] rounded-sm bg-white dark:bg-[#111827] dark:border-[#1F2937]">
                        {/* Section Header */}
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e2e8f0] dark:border-[#1F2937]">
                            <div className="w-1 h-5 bg-[#1e3a8a]"></div>
                            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-base italic">About Swapan Journals</h2>
                        </div>
                        {/* Body */}
                        <div className="flex flex-col md:flex-row items-start gap-6 px-5 py-5">
                            <p className="text-[13.5px] text-[#374151] dark:text-[#CBD5E1] leading-relaxed flex-1 text-justify">
                                SwapanPublication publishes a growing collection of peer-reviewed academic journals spanning multiple disciplines including Social Sciences, Humanities, Engineering, and Applied Sciences. Available in open-access format, SwapanPublication's high-impact journals constitute a comprehensive archive of scholarly research, covering emerging and established fields for both practical and theoretical applications. Our journal editors are thought leaders in their respective disciplines, and SwapanPublication's commitment to rigorous peer review ensures the highest standards in communicating significant research findings, innovative ideas, and scholarly discoveries to a global audience.
                            </p>
                            <div className="flex flex-col items-center justify-center flex-shrink-0 gap-2 min-w-[120px]">
                                <div className="w-20 h-20 rounded-full bg-[#1a3550] flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-2xl font-serif">SP</span>
                                </div>
                                <span className="text-[11px] font-bold text-[#1e3a8a] dark:text-[#60a5fa] tracking-widest uppercase">Swapan Journals</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Journal List */}
                <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-6 bg-[#0077b5] rounded-full"></div>
                        <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-xl">All Journals</h2>
                    </div>

                    <div className="space-y-6">
                        {subjects.length === 0 ? (
                            <div className="text-center py-16 text-[#64748B]">
                                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                <p>No journals found.</p>
                            </div>
                        ) : subjects.map((s, i) => {
                            const colorKey = s.name.toLowerCase();
                            const journalInfo = JOURNAL_DATA[colorKey] || DEFAULT_JOURNAL;
                            const nameWithoutJournal = s.name.toLowerCase().endsWith('journal') ? s.name.substring(0, s.name.length - 7).trim() : s.name;
                            const acronym = 'S' + nameWithoutJournal.split(' ').map(w => w.charAt(0).toUpperCase()).join('') + 'J';

                            return (
                                <div key={s._id} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#1F2937] dark:bg-[#111827] flex flex-col md:flex-row gap-6 p-5 group">
                                    {/* Cover Thumbnail */}
                                    {journalInfo.coverImage ? (
                                        <div className="w-full md:w-[160px] flex-shrink-0 shadow-md mx-auto md:mx-0 overflow-hidden bg-white border border-[#E2E8F0] dark:border-[#334155] rounded-lg h-fit self-start">
                                            <img src={journalInfo.coverImage} alt={`${s.name} Cover`} className="w-full h-auto object-cover" />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-full md:w-[160px] h-[220px] flex flex-col justify-between items-center text-center p-4 flex-shrink-0 shadow-md mx-auto md:mx-0 rounded-lg self-start"
                                            style={{
                                                background: COVER_GRADIENTS[colorKey] || COVER_GRADIENTS.default,
                                                color: 'white',
                                            }}
                                        >
                                            <span className="font-bold text-[12px] tracking-widest uppercase mt-4" style={{ color: 'rgba(255,255,255,0.85)' }}>Swapan</span>
                                            <span className="font-serif text-6xl font-bold leading-none" style={{ color: 'white' }}>{nameWithoutJournal.charAt(0)}</span>
                                            <span className="text-[12px] tracking-wide uppercase mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>Journal</span>
                                        </div>
                                    )}
                                    {/* Info */}
                                    <div className="flex-1 flex flex-col">
                                        {/* Top Badges */}
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                            <span className="bg-[#0b3d91] text-white px-3 py-1 text-xs font-bold rounded-full tracking-wider shadow-sm">
                                                {acronym}
                                            </span>
                                            <span className="bg-[#eff6ff] dark:bg-[#1e3a8a]/30 text-[#1e40af] dark:text-[#60a5fa] px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm border border-[#bfdbfe] dark:border-[#1e3a8a]">
                                                <Award className="w-3.5 h-3.5" /> Peer Reviewed Journal
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="cursor-pointer font-serif font-bold text-[#111827] dark:text-[#F1F5F9] text-xl lg:text-2xl leading-tight mb-3 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]" onClick={() => handleJournalSelect(s._id)}>
                                            <span className="hover:text-[#0b3d91] dark:hover:text-[#3b82f6] transition-colors">{acronym} — Swapan {nameWithoutJournal} Journal</span>
                                        </h3>
                                        
                                        {/* Description */}
                                        <p className="text-[#4b5563] dark:text-[#CBD5E1] text-[14px] leading-relaxed mb-5 line-clamp-3 text-justify">
                                            {journalInfo.description}
                                        </p>
                                        
                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 pb-5 border-b border-[#E2E8F0] dark:border-[#334155]">
                                            <div className="flex gap-2.5 items-center">
                                                <div className="bg-[#eff6ff] dark:bg-[#1e3a8a]/20 p-2 rounded-lg text-[#0b3d91] dark:text-[#60a5fa]">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider mb-0.5">Discipline</div>
                                                    <div className="text-[12px] text-[#6b7280] dark:text-[#94A3B8] leading-tight">{journalInfo.discipline || 'General'}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2.5 items-center">
                                                <div className="bg-[#eff6ff] dark:bg-[#1e3a8a]/20 p-2 rounded-lg text-[#0b3d91] dark:text-[#60a5fa]">
                                                    <Hash className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider mb-0.5">
                                                        {s.issn ? 'ISSN' : 'ISSN Certified'}
                                                    </div>
                                                    {s.issn && (
                                                        <div className="text-[12px] text-[#6b7280] dark:text-[#94A3B8] leading-tight">{s.issn}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2.5 items-center">
                                                <div className="bg-[#eff6ff] dark:bg-[#1e3a8a]/20 p-2 rounded-lg text-[#0b3d91] dark:text-[#60a5fa]">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-[#111827] dark:text-[#F1F5F9] uppercase tracking-wider mb-0.5">Established</div>
                                                    <div className="text-[12px] text-[#6b7280] dark:text-[#94A3B8] leading-tight">{journalInfo.established || '2022'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer: EIC and Button */}
                                        <div className="mt-auto flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                {journalInfo.eicPhoto ? (
                                                    <img src={journalInfo.eicPhoto} alt="EIC" className="w-11 h-11 rounded-full object-cover shadow-sm border border-[#E2E8F0] dark:border-[#334155]" />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-full bg-[#f1f5f9] dark:bg-[#334155] flex items-center justify-center shadow-sm border border-[#E2E8F0] dark:border-[#1F2937]">
                                                        <span className="text-[#64748B] dark:text-[#94A3B8] text-[10px] font-bold">EIC</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-[12px] font-bold text-[#0b3d91] dark:text-[#60a5fa] mb-0.5">Editor-in-Chief</div>
                                                    <div className="text-[13px] text-[#4b5563] dark:text-[#CBD5E1]">{journalInfo.eicName || 'Editorial Board'}</div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleJournalSelect(s._id)}
                                                className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#0b3d91] hover:bg-[#082f6e] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                            >
                                                View More <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                </div> {/* end zoom wrapper */}

                <Footer />
            </div>
        );
    }

    // ——— JOURNAL DETAIL STATE (journal selected) ———
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <div style={{ zoom: 0.80 }} className="flex-1 flex flex-col w-full">
            {/* Journal Header Banner */}
            <div
                className="py-10 px-6 relative"
                style={{
                    backgroundImage: journalData.bannerImage
                        ? `linear-gradient(to right, rgba(74, 26, 92, 0.5) 0%, rgba(74, 26, 92, 0.6) 100%), url(${journalData.bannerImage})`
                        : journalData.gradient,
                    backgroundSize: journalData.bannerImage ? 'cover' : 'auto',
                    backgroundPosition: journalData.bannerImage ? 'center' : '0% 0%',
                    backgroundRepeat: journalData.bannerImage ? 'no-repeat' : 'repeat',
                    color: 'white'
                }}
            >
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10 min-h-[120px]">
                    <div className="flex-1">
                        {/* Title and tagline removed per request */}
                    </div>
                    {/* Journal Switcher Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                        >
                            Switch Journal <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a2d42] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
                                <button
                                    onClick={() => { setDropdownOpen(false); router.push('/browse'); }}
                                    className="w-full text-left px-4 py-3 text-sm text-[#94C8E0] hover:bg-white/10 border-b border-white/10"
                                >
                                    ← All Journals
                                </button>
                                {subjects.map(s => (
                                    <button
                                        key={s._id}
                                        onClick={() => handleJournalSelect(s._id)}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 flex justify-between items-center border-b border-white/10 last:border-0 ${s._id === subjectSlug ? 'text-white font-bold' : 'text-white/80'}`}
                                    >
                                        <span>{s.name}</span>
                                        {s._id === subjectSlug && <span className="text-[10px] text-[#94C8E0]">Active</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
                {/* About the Journal */}
                <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main content */}
                        <div className="flex-1">
                            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-xl mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#0077b5] rounded-full"></div>
                                About the Journal
                            </h2>
                            <div className="text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-5 whitespace-pre-line">{journalDesc}</div>

                            {journalData.scope && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-base mb-3 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-[#7b2d9e] rounded-full"></div>
                                        Scope of the Journal
                                    </h3>
                                    <ul className="space-y-2">
                                        {journalData.scope.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-[#475569] dark:text-[#94A3B8]">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7b2d9e] flex-shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <a href="/submit" className="inline-flex items-center gap-2 bg-[#0077b5] hover:bg-[#005e8e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                                    <FileText className="w-4 h-4" /> Submit Your Article
                                </a>
                            </div>
                        </div>

                        {/* Editor-in-Chief Card */}
                        <div className="lg:w-72 flex-shrink-0">
                            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl p-6">
                                <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-sm uppercase tracking-wider mb-5 text-center">Editor-in-Chief</h3>
                                {/* Photo Placeholder or Image */}
                                {journalData.eicPhoto ? (
                                    <img 
                                        src={journalData.eicPhoto} 
                                        alt={journalData.eicName || 'Editor-in-Chief'} 
                                        className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-[#1F2937] shadow-lg"
                                    />
                                ) : (
                                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#7b2d9e] to-[#0077b5] mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-[#1F2937] shadow-lg">
                                        <span className="text-white opacity-60 text-sm text-center">Photo</span>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-base">{journalData.eicName || 'To Be Announced'}</p>
                                    <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">{journalData.eicTitle || journalTitle}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1F2937]">
                                    <p className="text-xs text-[#94A3B8] text-center">Contact via</p>
                                    <p className="text-xs text-[#0077b5] text-center font-medium">editor@swarnpublication.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E2E8F0] dark:border-[#1F2937]">
                        <div className="text-center">
                            <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-xl">{selectedJournal?.paperCount || 0}</p>
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Published Articles</p>
                        </div>
                        <div className="text-center border-x border-[#E2E8F0] dark:border-[#1F2937]">
                            <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-xl">Open</p>
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Access Policy</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-xl">Peer</p>
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Reviewed</p>
                        </div>
                    </div>
                </div>

                {/* Articles Section */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-5 bg-[#0077b5] rounded-full"></div>
                    <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-xl">Articles</h2>
                </div>

                {(!papers || papers.length === 0) ? (
                    <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-xl border border-[#E2E8F0] dark:border-[#1F2937]">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40 text-[#64748B]" />
                        <p className="text-[#64748B] dark:text-[#94A3B8]">No articles published in this journal yet.</p>
                        <a href="/submit" className="mt-4 inline-block text-[#0077b5] hover:underline text-sm font-medium">Be the first to submit →</a>
                    </div>
                ) : (
                    <>
                        <div className="swarn-home-override">
                            <div className="papers-list flex flex-col gap-6">
                                {papers.map((paper) => {
                                    const authorNames = Array.isArray(paper.authors) ? paper.authors.map((a: string) => a.split(' | ')[0].trim()).filter(Boolean).join(', ') : 'Unknown';
                                    const subjectName = typeof paper.subject === 'object' && paper.subject?.name ? paper.subject.name : 'Research';
                                    const publishedDate = paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                    
                                    return (
                                        <div className="acm-paper-card" key={paper._id} onClick={() => router.push(`/paper/${paper.slug}`)}>
                                            <div className="acm-paper-left">
                                                {paper.coverImage && (
                                                    <img 
                                                        src={paper.coverImage} 
                                                        alt="Cover" 
                                                        className="acm-paper-cover" 
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const nextEl = e.currentTarget.nextElementSibling;
                                                            if (nextEl) (nextEl as HTMLElement).style.display = 'flex';
                                                        }} 
                                                    />
                                                )}
                                                <div className="acm-paper-cover-placeholder" style={{ display: paper.coverImage ? 'none' : 'flex' }}>
                                                    <span>{subjectName?.[0] || 'R'}</span>
                                                </div>
                                            </div>
                                            <div className="acm-paper-center">
                                                <div className="acm-paper-meta-top">
                                                    <span className="acm-paper-type">{subjectName}</span>
                                                    <span className="acm-paper-status">{paper.status === 'published' ? 'Published' : 'Under Review'}</span>
                                                </div>
                                                <div className="acm-paper-title break-words">{paper.title}</div>
                                                <div className="acm-paper-authors break-words">{authorNames}</div>
                                                <div className="acm-paper-abstract break-words line-clamp-4">{paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}</div>
                                                {paper.keywords && paper.keywords.length > 0 && (
                                                    <div className="acm-paper-keywords">
                                                        {paper.keywords.map((kw: string, i: number) => (
                                                            <span key={i} className="acm-paper-keyword">{kw}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="acm-paper-right">
                                                <div className="acm-paper-stats-list">
                                                    <div className="acm-stat-item">
                                                        <div className="acm-stat-icon view-icon"><Eye className="w-4 h-4"/></div>
                                                        <div className="acm-stat-info">
                                                            <span className="acm-stat-val">{paper.views >= 1000 ? (paper.views/1000).toFixed(1) + 'K' : (paper.views || 0)}</span>
                                                            <span className="acm-stat-lbl">Views</span>
                                                        </div>
                                                    </div>
                                                    <div className="acm-stat-item">
                                                        <div className="acm-stat-icon download-icon"><Download className="w-4 h-4"/></div>
                                                        <div className="acm-stat-info">
                                                            <span className="acm-stat-val">{paper.downloads >= 1000 ? (paper.downloads/1000).toFixed(1) + 'K' : (paper.downloads || 0)}</span>
                                                            <span className="acm-stat-lbl">Downloads</span>
                                                        </div>
                                                    </div>
                                                    <div className="acm-stat-item">
                                                        <div className="acm-stat-icon date-icon"><Calendar className="w-4 h-4"/></div>
                                                        <div className="acm-stat-info">
                                                            <span className="acm-stat-val">{publishedDate}</span>
                                                            <span className="acm-stat-lbl">Published</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="acm-paper-actions">
                                                    <Link
                                                        href={`/paper/${paper.slug}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="acm-view-btn"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Read Paper
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <Button variant="outline" disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>Previous</Button>
                                <span className="flex items-center text-sm font-medium px-4">Page {pagination.page} of {pagination.totalPages}</span>
                                <Button variant="outline" disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>Next</Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
            </div>
        </div>
    );
}


