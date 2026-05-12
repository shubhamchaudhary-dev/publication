'use client';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus } from 'lucide-react';
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

const schema = z.object({
    correspondingEmail: z.string().email('Valid email is required'),
    title: z.string().min(5, 'Title is too short'),
    abstract: z.string().min(50, 'Abstract must be at least 50 characters'),
    authors: z.array(authorSchema).min(1, 'At least one author is required'),
    subject: z.string().min(1, 'Please select a journal'),
    declaration: z.boolean().refine(val => val === true, {
        message: 'You must accept the submission declaration'
    })
});

type FormData = z.infer<typeof schema>;

export default function SubmitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const queryClient = useQueryClient();

    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');
    const [submitError, setSubmitError] = useState('');

    const { data: subjectsData } = useQuery<{ _id: string, name: string }[]>({
        queryKey: ['subjects'],
        queryFn: async () => (await api.get('/api/subjects')).data.data,
    });

    const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            authors: [{ name: '', email: '', contact: '', address: '', designation: '' }],
            declaration: false
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "authors"
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
        if (!editId && !file) {
            setFileError('Manuscript file is required');
            return;
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
                authors: combinedAuthors,
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
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[var(--white)] font-sans">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                <div className="bg-white dark:bg-[var(--paper)] rounded-lg border border-[#E2E8F0] dark:border-[var(--border)] p-8 shadow-sm">
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Section 1: Basic Info */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[14px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Corresponding Author Email*</label>
                                <input 
                                    {...register('correspondingEmail')} 
                                    className="w-full h-11 px-3 py-2 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-[4px] text-[15px] focus:outline-none focus:border-[#2563EB] dark:text-white"
                                    placeholder="Enter Corresponding Author Email"
                                />
                                {errors.correspondingEmail && <p className="text-red-500 text-xs mt-1">{errors.correspondingEmail.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[14px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Paper Title*</label>
                                <input 
                                    {...register('title')} 
                                    className="w-full h-11 px-3 py-2 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-[4px] text-[15px] focus:outline-none focus:border-[#2563EB] dark:text-white"
                                    placeholder="Enter the title of your paper"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[14px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Abstract*</label>
                                <textarea 
                                    {...register('abstract')} 
                                    className="w-full min-h-[120px] px-3 py-2 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-[4px] text-[15px] focus:outline-none focus:border-[#2563EB] dark:text-white"
                                    placeholder="Enter abstract..."
                                />
                                {errors.abstract && <p className="text-red-500 text-xs mt-1">{errors.abstract.message}</p>}
                            </div>
                        </div>

                        {/* Section 2: Authors Profiles */}
                        <div>
                            <h3 className="text-[18px] font-bold text-[#EF4444] dark:text-[#F87171] mb-4">Add all authors' profiles here</h3>
                            
                            <div className="bg-[#F8FAFC] dark:bg-[var(--sand)] p-6 rounded-lg border border-[#E2E8F0] dark:border-[var(--border)] space-y-6">
                                {fields.map((item, index) => (
                                    <div key={item.id} className="relative bg-white dark:bg-[var(--paper)] p-5 rounded-md border border-[#CBD5E1] dark:border-[var(--border-light)] space-y-4">
                                        {index > 0 && (
                                            <button 
                                                type="button" 
                                                onClick={() => remove(index)}
                                                className="absolute top-4 right-4 text-sm text-red-500 hover:underline font-medium"
                                            >
                                                Remove Author
                                            </button>
                                        )}
                                        
                                        <div>
                                            <label className="block text-[13.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Author {index + 1}: Name (Mr./Mrs./Ms./Dr.)*</label>
                                            <input 
                                                {...register(`authors.${index}.name` as const)} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-[4px] text-[14px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                                placeholder="Enter Author's Name"
                                            />
                                            {errors.authors?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.name?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Author {index + 1}: Email*</label>
                                            <input 
                                                {...register(`authors.${index}.email` as const)} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-[4px] text-[14px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                                placeholder="Enter Author's Email"
                                            />
                                            {errors.authors?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.email?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Author {index + 1}: Contact Number*</label>
                                            <input 
                                                {...register(`authors.${index}.contact` as const)} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-[4px] text-[14px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                                placeholder="Enter Author's Contact Number"
                                            />
                                            {errors.authors?.[index]?.contact && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.contact?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Author {index + 1}: Postal Address*</label>
                                            <input 
                                                {...register(`authors.${index}.address` as const)} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-[4px] text-[14px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                                placeholder="Enter Author's Postal Address"
                                            />
                                            {errors.authors?.[index]?.address && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.address?.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Author {index + 1}: Official Designation and Address*</label>
                                            <input 
                                                {...register(`authors.${index}.designation` as const)} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-[4px] text-[14px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                                placeholder="Enter Author's Official Designation and Address"
                                            />
                                            {errors.authors?.[index]?.designation && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.designation?.message}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={() => append({ name: '', email: '', contact: '', address: '', designation: '' })}
                                className="mt-4 flex items-center gap-1 bg-[#16A34A] hover:bg-[#15803D] text-white px-4 py-2 rounded-[4px] text-[14px] font-bold transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Author
                            </button>
                        </div>

                        {/* Section 3: Document Uploads */}
                        <div className="space-y-6 pt-4">
                            <div>
                                <label className="block text-[14px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Select Journal*</label>
                                <select 
                                    {...register('subject')} 
                                    className="w-full h-11 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-[4px] text-[14px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-transparent dark:text-white appearance-none"
                                >
                                    <option value="" className="text-gray-500 dark:bg-[var(--paper)]">Select</option>
                                    {(Array.isArray(subjectsData) ? subjectsData : (subjectsData as any)?.data || []).map((s: any) => (
                                        <option key={s._id} value={s._id} className="dark:bg-[var(--paper)]">{s.name}</option>
                                    ))}
                                </select>
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>

                            {!editId && (
                                <div>
                                    <label className="block text-[14px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Attach Word Manuscript (Up to 5MB)*</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFile(e.target.files[0]);
                                                    setFileError('');
                                                }
                                            }}
                                        />
                                        <label htmlFor="fileUpload" className="cursor-pointer bg-[#F1F5F9] dark:bg-[var(--sand)] border border-[#CBD5E1] dark:border-[var(--border)] hover:bg-[#E2E8F0] dark:hover:bg-[#333] px-3 py-1.5 text-[13px] text-[#475569] dark:text-[#cbd5e1] rounded-[4px] shadow-sm font-medium transition-colors">
                                            Choose File
                                        </label>
                                        <span className="text-[13px] text-[#475569] dark:text-[#94A3B8]">
                                            {file ? file.name : 'No file chosen'}
                                        </span>
                                    </div>
                                    {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
                                </div>
                            )}

                            <div>
                                <label className="flex items-start gap-2 cursor-pointer mt-6">
                                    <input 
                                        type="checkbox" 
                                        {...register('declaration')} 
                                        className="mt-[3px] w-4 h-4 cursor-pointer"
                                    />
                                    <div className="text-[13.5px] text-[#1E293B] dark:text-[#F8FAFC]">
                                        Submission Declaration<br />
                                        <a href="#" className="text-[#EA580C] dark:text-[#F97316] hover:underline font-medium">Read Declaration</a>
                                    </div>
                                </label>
                                {errors.declaration && <p className="text-red-500 text-xs mt-1">{errors.declaration.message}</p>}
                            </div>
                        </div>

                        {submitError && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm font-medium">{submitError}</div>}

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="bg-[#64748B] hover:bg-[#475569] dark:bg-[var(--btn-solid-bg)] dark:hover:bg-[var(--btn-solid-hover)] text-white px-8 py-2.5 rounded-[4px] text-[15px] font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editId ? 'Save Changes' : 'Submit'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
