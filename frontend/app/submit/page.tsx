'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, FileText, Users, UploadCloud, CheckSquare, Info, Upload } from 'lucide-react';
import axios from 'axios';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';

const authorSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    contact: z.string().min(5, 'Contact number is required'),
    address: z.string().min(5, 'Postal address is required'),
    designation: z.string().min(2, 'Designation is required'),
});

const reviewerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    designation: z.string().min(2, 'Designation is required'),
    affiliation: z.string().min(2, 'Affiliation is required'),
    email: z.string().email('Valid email is required'),
    contact: z.string().min(5, 'Contact number is required'),
    researchArea: z.string().min(2, 'Research area is required'),
});

const schema = z.object({
    correspondingEmail: z.string().email('Valid email is required'),
    title: z.string().min(5, 'Title is too short'),
    abstract: z.string().min(50, 'Abstract must be at least 50 characters'),
    highlights: z.string().min(10, 'Highlights must be at least 10 characters'),
    keywordsStr: z.string().refine(val => {
        const arr = val.split(',').map(s => s.trim()).filter(Boolean);
        return arr.length >= 6;
    }, 'At least 6 keywords are required (separate with commas)'),
    authors: z.array(authorSchema).min(1, 'At least one author is required'),
    reviewers: z.array(reviewerSchema).min(1, 'At least 1 reviewer is required').max(5, 'At most 5 reviewers are allowed'),
    subject: z.string().min(1, 'Please select a journal'),
    declaration: z.boolean().refine(val => val === true, {
        message: 'You must accept the submission declaration'
    })
});

type FormData = z.infer<typeof schema>;

export default function SubmitPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading form...</div>}>
            <SubmitContent />
        </React.Suspense>
    );
}

function SubmitContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const queryClient = useQueryClient();

    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const step = parseInt(entry.target.id.split('-')[1]);
                        if (!isNaN(step)) setActiveStep(step);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );

        [1, 2, 3, 4].forEach(step => {
            const el = document.getElementById(`step-${step}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
    const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

    const { data: subjectsData } = useQuery<{ _id: string, name: string }[]>({
        queryKey: ['subjects'],
        queryFn: async () => (await api.get('/api/subjects')).data.data,
    });

    const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            keywordsStr: '',
            highlights: '',
            authors: [{ name: '', email: '', contact: '', address: '', designation: '' }],
            reviewers: [
                { name: '', designation: '', affiliation: '', email: '', contact: '', researchArea: '' }
            ],
            declaration: false
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "authors"
    });

    const { fields: reviewerFields, append: appendReviewer, remove: removeReviewer } = useFieldArray({
        control,
        name: "reviewers"
    });

    // Pre-fill if edit
    useEffect(() => {
        if (editId) {
            api.get(`/api/papers`).then(res => {
                const p = res.data.data.find((x: any) => x._id === editId);
                if (p) {
                    setValue('title', p.title);
                    setValue('abstract', p.abstract);
                    setValue('subject', typeof p.subject === 'string' ? p.subject : p.subject?._id);
                    // For editing, we parse out the single strings into our structured format if possible.
                    // For simplicity, if we can't parse it, we just dump it in the first author's name.
                    if (p.authors && p.authors.length > 0) {
                        const parsedAuthors = p.authors.map((str: string) => {
                            // Example string format: "Dr. Jane Doe | email@test.com | 12345 | Address | Designation"
                            const parts = str.split(' | ');
                            if (parts.length === 5) {
                                return { name: parts[0], email: parts[1], contact: parts[2], address: parts[3], designation: parts[4] };
                            }
                            return { name: str, email: 'unknown@example.com', contact: 'N/A', address: 'N/A', designation: 'N/A' };
                        });
                        setValue('authors', parsedAuthors);
                    }
                }
            });
        }
    }, [editId, setValue]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/dashboard');
        }
    }, [authLoading, isAuthenticated, user, router]);

    const onSubmit = async (data: FormData) => {
        setSubmitError('');
        if (!editId) {
            if (!file) {
                setFileError('Manuscript file is required');
                return;
            }
            if (!coverLetterFile) {
                setSubmitError('Cover Letter is required. Please attach a Word document.');
                return;
            }
        }

        try {
            // Combine author objects into backend-compatible strings
            const combinedAuthors = data.authors.map(a => 
                `${a.name} | ${a.email} | ${a.contact} | ${a.address} | ${a.designation}`
            );

            const finalAbstract = `[Corresponding Email: ${data.correspondingEmail}]\n\n${data.abstract}`;

            let finalData: any = {
                title: data.title,
                abstract: finalAbstract,
                highlights: data.highlights,
                keywords: data.keywordsStr.split(',').map(s => s.trim()).filter(Boolean),
                authors: combinedAuthors,
                reviewers: data.reviewers,
                subjectId: data.subject,
            };

            if (file) {
                const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(f);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
                const base64 = await toBase64(file);
                finalData.pdfUrl = base64;
            }

            if (coverLetterFile) {
                const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(f);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
                finalData.coverLetterUrl = await toBase64(coverLetterFile);
                finalData.coverLetterName = coverLetterFile.name;
            }

            if (editId) {
                // PUT request uses JSON
                await api.put(`/api/papers/${editId}`, finalData);
            } else {
                // POST request also uses JSON now
                await api.post('/api/papers', finalData);
            }

            queryClient.invalidateQueries({ queryKey: ['papers'] });
            router.push('/dashboard?tab=papers&success=true');
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || err.message || 'Submission failed');
        }
    };

    if (authLoading || !isAuthenticated) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] font-sans">
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar */}
                    <div className="lg:w-[320px] shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-[#19344f] dark:text-white mb-2 tracking-tight">Submit Your Paper</h1>
                                <p className="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">
                                    Fill in the details below to submit your paper for review and publication.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#EEF2FF] dark:bg-[#1E293B] p-2 rounded-lg">
                                        <FileText className="w-5 h-5 text-[#4F46E5] dark:text-[#818CF8]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Guidelines</h3>
                                        <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                                            Ensure your paper follows our publication guidelines and format requirements.
                                        </p>
                                        <a href="/publish-guidelines" target="_blank" className="text-[13px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1">
                                            View Guidelines &rarr;
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#F0FDF4] dark:bg-[#14532D]/30 p-2 rounded-lg">
                                        <Info className="w-5 h-5 text-[#16A34A] dark:text-[#4ADE80]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Need Help?</h3>
                                        <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                                            If you have any questions, please contact our support team.
                                        </p>
                                        <a href="/contact" target="_blank" className="text-[13px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1">
                                            Contact Us &rarr;
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Step Tracker */}
                            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-6 shadow-sm hidden lg:block">
                                <div className="space-y-6">
                                    {[
                                        { step: 1, title: 'Paper Details', desc: 'Enter your paper information' },
                                        { step: 2, title: 'Authors', desc: 'Add all authors and their details' },
                                        { step: 3, title: 'Upload Files', desc: 'Upload your manuscript and files' },
                                        { step: 4, title: 'Review & Submit', desc: 'Review your information and submit' }
                                    ].map((s) => (
                                        <div key={s.step} className="flex items-start gap-4 transition-opacity duration-300" style={{ opacity: activeStep >= s.step ? 1 : 0.6 }}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-300 ${activeStep === s.step ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20' : activeStep > s.step ? 'bg-[#10B981] text-white' : 'bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155]'}`}>
                                                {activeStep > s.step ? <CheckSquare className="w-4 h-4" /> : s.step}
                                            </div>
                                            <div>
                                                <div className={`text-[14px] font-bold transition-colors duration-300 ${activeStep === s.step ? 'text-[#2563EB]' : 'text-[#1E293B] dark:text-white'}`}>{s.title}</div>
                                                <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">{s.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Section 1: Paper Details */}
                            <div id="step-1" className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden scroll-mt-24">
                                <div className="border-b border-[#E2E8F0] dark:border-[#334155] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">1. Paper Details</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Provide the basic information about your paper.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Corresponding Author Email <span className="text-red-500">*</span></label>
                                            <input 
                                                {...register('correspondingEmail')} 
                                                className="w-full h-10 px-3 py-2 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow"
                                                placeholder="Enter corresponding author email"
                                            />
                                            {errors.correspondingEmail && <p className="text-red-500 text-xs mt-1.5">{errors.correspondingEmail.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Paper Title <span className="text-red-500">*</span></label>
                                            <input 
                                                {...register('title')} 
                                                className="w-full h-10 px-3 py-2 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow"
                                                placeholder="Enter the title of your paper"
                                            />
                                            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Abstract <span className="text-red-500">*</span></label>
                                        <textarea 
                                            {...register('abstract')} 
                                            className="w-full min-h-[120px] px-3 py-3 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow resize-y"
                                            placeholder="Enter your paper abstract..."
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.abstract ? <p className="text-red-500 text-xs">{errors.abstract.message}</p> : <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8]">A brief summary of your paper</p>}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Highlights (Key Points) <span className="text-red-500">*</span></label>
                                        <textarea 
                                            {...register('highlights')} 
                                            className="w-full min-h-[100px] px-3 py-3 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow resize-y"
                                            placeholder="Enter the key highlights of your paper..."
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.highlights ? <p className="text-red-500 text-xs">{errors.highlights.message}</p> : <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8]">Summarize the main contributions</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Keywords <span className="text-red-500">*</span></label>
                                        <input 
                                            {...register('keywordsStr')} 
                                            className="w-full h-10 px-3 py-2 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow"
                                            placeholder="e.g. machine learning, data mining, artificial intelligence"
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.keywordsStr ? <p className="text-red-500 text-xs">{errors.keywordsStr.message}</p> : <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8]">Minimum 6 keywords, separated by commas</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Subject Area / Category <span className="text-red-500">*</span></label>
                                            <select 
                                                {...register('subject')} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                            >
                                                <option value="" className="text-gray-500 dark:bg-[#1E293B]">Select subject area</option>
                                                {(Array.isArray(subjectsData) ? subjectsData : (subjectsData as any)?.data || []).map((s: any) => (
                                                    <option key={s._id} value={s._id} className="dark:bg-[#1E293B]">{s.name}</option>
                                                ))}
                                            </select>
                                            {errors.subject && <p className="text-red-500 text-xs mt-1.5">{errors.subject.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Authors */}
                            <div id="step-2" className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden scroll-mt-24">
                                <div className="border-b border-[#E2E8F0] dark:border-[#334155] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">2. Authors</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Add all authors who contributed to this paper.</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => append({ name: '', email: '', contact: '', address: '', designation: '' })}
                                        className="flex items-center gap-1.5 bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#333] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#60A5FA]/20 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Author
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {fields.map((item, index) => (
                                        <div key={item.id} className="relative bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden">
                                            <div className="bg-[#F1F5F9] dark:bg-[#333]/50 border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-2.5 flex items-center justify-between">
                                                <div className="text-[13px] font-bold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-2">
                                                    <span className="opacity-50">&#8226;&#8226;&#8226;</span> Author {index + 1}
                                                </div>
                                                {index > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => remove(index)}
                                                        className="text-red-500 hover:text-red-600 p-1"
                                                        title="Remove Author"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`authors.${index}.name` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                        placeholder="e.g. Dr. John Doe"
                                                    />
                                                    {errors.authors?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.name?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Email <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`authors.${index}.email` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                        placeholder="Enter email address"
                                                    />
                                                    {errors.authors?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.email?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`authors.${index}.contact` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                        placeholder="Enter contact number"
                                                    />
                                                    {errors.authors?.[index]?.contact && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.contact?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Designation <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`authors.${index}.designation` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                        placeholder="Enter designation"
                                                    />
                                                    {errors.authors?.[index]?.designation && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.designation?.message}</p>}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Postal Address <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`authors.${index}.address` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                        placeholder="Enter complete postal address"
                                                    />
                                                    {errors.authors?.[index]?.address && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.address?.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2.5: Reviewers */}
                            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden">
                                <div className="border-b border-[#E2E8F0] dark:border-[#334155] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">Suggested Reviewers</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">List of suggested reviewers (Min 1 - Max 5)</p>
                                        </div>
                                    </div>
                                    {reviewerFields.length < 5 && (
                                        <button 
                                            type="button" 
                                            onClick={() => appendReviewer({ name: '', designation: '', affiliation: '', email: '', contact: '', researchArea: '' })}
                                            className="flex items-center gap-1.5 bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#333] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#60A5FA]/20 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                                        >
                                            <Plus className="w-4 h-4" /> Add Reviewer
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 space-y-6">
                                    {reviewerFields.map((item, index) => (
                                        <div key={item.id} className="relative bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden">
                                            <div className="bg-[#F1F5F9] dark:bg-[#333]/50 border-b border-[#E2E8F0] dark:border-[#334155] px-4 py-2.5 flex items-center justify-between">
                                                <div className="text-[13px] font-bold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-2">
                                                    <span className="opacity-50">&#8226;&#8226;&#8226;</span> Reviewer {index + 1}
                                                </div>
                                                {index > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeReviewer(index)}
                                                        className="text-red-500 hover:text-red-600 p-1"
                                                        title="Remove Reviewer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`reviewers.${index}.name` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.name?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Email <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`reviewers.${index}.email` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.email?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Designation <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`reviewers.${index}.designation` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.designation && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.designation?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Affiliation <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`reviewers.${index}.affiliation` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.affiliation && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.affiliation?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`reviewers.${index}.contact` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.contact && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.contact?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Research Area <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(`reviewers.${index}.researchArea` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[#1E293B] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.researchArea && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.researchArea?.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {errors.reviewers?.root && <p className="text-red-500 text-sm mt-2">{errors.reviewers.root.message}</p>}
                                </div>
                            </div>

                            {/* Section 3: Upload Files */}
                            <div id="step-3" className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden scroll-mt-24">
                                <div className="border-b border-[#E2E8F0] dark:border-[#334155] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <UploadCloud className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">3. Upload Files</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Upload your manuscript and any supporting files.</p>
                                        </div>
                                    </div>
                                    <div className="text-[12px] text-[#64748B] flex items-center gap-1 cursor-help">
                                        What to upload? <Info className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {!editId && (
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-[13.5px] font-bold text-[#1E293B] dark:text-white mb-2">Manuscript Document <span className="text-red-500">*</span></h3>
                                                <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border-2 border-[#E2E8F0] dark:border-[#334155] border-dashed rounded-xl cursor-pointer bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#333] transition-colors">
                                                    <Upload className="w-8 h-8 text-[#2563EB] mb-3" />
                                                    <span className="text-[14px] font-bold text-[#1E293B] dark:text-white mb-1">
                                                        {file ? 'File Selected' : 'Drag & drop your files here'}
                                                    </span>
                                                    <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-4">or</span>
                                                    <div className="bg-[#2563EB] text-white text-[13px] font-bold px-5 py-2 rounded-lg">
                                                        {file ? 'Change File' : 'Choose Files'}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setFile(e.target.files[0]);
                                                                setFileError('');
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8] mt-4 text-center">
                                                        Accepted formats: DOC, DOCX<br/>Maximum file size: 5MB per file
                                                    </p>
                                                </label>
                                                {file && <p className="text-[#16A34A] text-xs mt-2 font-medium">Attached: {file.name}</p>}
                                                {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
                                            </div>

                                            <div>
                                                <h3 className="text-[13.5px] font-bold text-[#1E293B] dark:text-white mb-2">Cover Letter <span className="text-red-500">*</span></h3>
                                                <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border-2 border-[#E2E8F0] dark:border-[#334155] border-dashed rounded-xl cursor-pointer bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#333] transition-colors">
                                                    <Upload className="w-8 h-8 text-[#2563EB] mb-3" />
                                                    <span className="text-[14px] font-bold text-[#1E293B] dark:text-white mb-1">
                                                        {coverLetterFile ? 'Cover Letter Selected' : 'Drag & drop your cover letter'}
                                                    </span>
                                                    <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-4">or</span>
                                                    <div className="bg-[#2563EB] text-white text-[13px] font-bold px-5 py-2 rounded-lg">
                                                        {coverLetterFile ? 'Change File' : 'Choose Files'}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setCoverLetterFile(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8] mt-4 text-center">
                                                        Accepted formats: DOC, DOCX
                                                    </p>
                                                </label>
                                                {coverLetterFile && <p className="text-[#16A34A] text-xs mt-2 font-medium">Attached: {coverLetterFile.name}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 4: Review & Submit */}
                            <div id="step-4" className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm overflow-hidden scroll-mt-24">
                                <div className="border-b border-[#E2E8F0] dark:border-[#334155] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20">
                                    <div className="flex items-center gap-3">
                                        <CheckSquare className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">4. Review & Submit</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Please review your information before submitting.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 border border-[#BFDBFE] dark:border-[#1E3A8A] rounded-lg p-4 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
                                        <p className="text-[13px] text-[#1E3A8A] dark:text-[#BFDBFE] leading-relaxed">
                                            Please ensure all details are accurate. You can go back and edit if needed before making the final submission.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center mt-0.5">
                                                <input 
                                                    type="checkbox" 
                                                    {...register('declaration')} 
                                                    className="peer appearance-none w-5 h-5 border-2 border-[#CBD5E1] dark:border-[#334155] rounded bg-white dark:bg-[#0F172A] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer"
                                                />
                                                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </div>
                                            <div className="text-[13.5px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                                                I confirm that this paper is original, has not been published elsewhere, and all authors agree to this submission. I have read and accept the <a href="/declaration" target="_blank" className="text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold">Submission Declaration</a>.
                                            </div>
                                        </label>
                                        {errors.declaration && <p className="text-red-500 text-xs mt-2 pl-8">{errors.declaration.message}</p>}
                                    </div>

                                    {submitError && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-medium border border-red-200 dark:border-red-900/50">{submitError}</div>}

                                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <button 
                                            type="button"
                                            className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-[14px] font-bold hover:bg-[#F8FAFC] dark:hover:bg-[#333] transition-colors"
                                        >
                                            Save as Draft
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-md shadow-[#2563EB]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {editId ? 'Save Changes' : 'Review & Submit Paper'}
                                            {!isSubmitting && !editId && <span className="text-lg leading-none mb-0.5">&rarr;</span>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
            
            <div className="py-6 text-center text-[12px] text-[#94A3B8] border-t border-[#E2E8F0] dark:border-[#334155] mt-8">
                <div className="flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Your information is secure and will only be used for the review and publication process.
                </div>
            </div>
            
        </div>
    );
}
