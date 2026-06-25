'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Paper } from '@/components/PaperCard';
import { Button } from '@/components/ui/button';

export default function AdminPapersPage() {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const statusFilter = searchParams.get('status') || 'all';
    const [reviewingPaper, setReviewingPaper] = useState<(Paper & { authors: string[] }) | null>(null);
    const [reviewRemarks, setReviewRemarks] = useState('');
    const [reviewStatus, setReviewStatus] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [successToast, setSuccessToast] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverUploading, setCoverUploading] = useState(false);
    // Correction files state (images: up to 5, document: 1)
    const [correctionFiles, setCorrectionFiles] = useState<File[]>([]);
    const [correctionUploading, setCorrectionUploading] = useState(false);
    const [correctionError, setCorrectionError] = useState('');
    const [correctionSuccess, setCorrectionSuccess] = useState(false);
    const [correctionMode, setCorrectionMode] = useState<'image' | 'document'>('document');

    const togglePaperMembershipMutation = useMutation({
        mutationFn: async ({ id, requiresMembership }: { id: string; requiresMembership: boolean }) => {
            await api.put(`/api/admin/papers/${id}/membership`, { requiresMembership });
            return { requiresMembership };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
            setReviewingPaper((prev: any) => prev ? { ...prev, requiresMembership: data.requiresMembership } : null);
        },
    });

    const showToast = (msg: string) => {
        setSuccessToast(msg);
        setTimeout(() => setSuccessToast(''), 3500);
    };

    const setStatusFilter = (val: string) => {
        if (val === 'all') router.push('/admin/papers');
        else router.push(`/admin/papers?status=${val}`);
    };

    const handleSendCorrectionFile = async () => {
        if (!reviewingPaper || correctionFiles.length === 0) return;
        setCorrectionError('');
        setCorrectionSuccess(false);
        setCorrectionUploading(true);
        try {
            const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });
            const filesPayload = await Promise.all(
                correctionFiles.map(async (f) => ({ fileBase64: await toBase64(f), fileName: f.name }))
            );
            await api.post(`/api/admin/papers/${reviewingPaper._id}/correction-file`, { files: filesPayload });
            queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
            setCorrectionFiles([]);
            setCorrectionSuccess(true);
            showToast(`✅ ${filesPayload.length} correction file(s) sent to author!`);
        } catch (e: any) {
            setCorrectionError(e?.response?.data?.message || 'Upload failed');
        } finally {
            setCorrectionUploading(false);
        }
    };

    const { data: papersData, isLoading } = useQuery<{ data: Paper[] }>({
        queryKey: ['admin', 'papers', statusFilter],
        queryFn: async () => {
            const url = statusFilter === 'all' ? '/api/admin/papers?limit=100' : `/api/admin/papers?status=${statusFilter}&limit=100`;
            const res = await api.get(url);
            return res.data;
        },
    });

    const reviewMutation = useMutation({
        mutationFn: async ({ id, status, remarks }: { id: string, status: string, remarks: string }) => {
            await api.put(`/api/admin/papers/${id}/review`, { status, remarks });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
            setReviewingPaper(null);
            setPdfFile(null);
            setCoverFile(null);
            setUploadError('');
            showToast('Review saved successfully.');
        }
    });

    const handleCoverUpload = async () => {
        if (!reviewingPaper || !coverFile) return;
        setUploadError('');
        setCoverUploading(true);
        try {
            const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });
            const base64 = await toBase64(coverFile);
            await api.post(`/api/admin/papers/${reviewingPaper._id}/cover`, { coverImageBase64: base64 });
            queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
            setCoverFile(null);
            showToast('✅ Cover image uploaded!');
        } catch (e: any) {
            setUploadError(e?.response?.data?.message || 'Cover upload failed');
        } finally {
            setCoverUploading(false);
        }
    };

    const handleSaveReview = async () => {
        if (!reviewingPaper) return;
        setUploadError('');

        // If status is published or pre_proof AND a PDF file was selected, upload it
        if ((reviewStatus === 'published' || reviewStatus === 'pre_proof') && pdfFile) {
            try {
                setUploading(true);
                const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(f);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                });
                const base64 = await toBase64(pdfFile);
                await api.post(`/api/admin/papers/${reviewingPaper._id}/upload-pdf`, { pdfBase64: base64 });
                // Save remarks separately
                if (reviewRemarks || reviewStatus) {
                    await api.put(`/api/admin/papers/${reviewingPaper._id}/review`, { status: reviewStatus, remarks: reviewRemarks });
                }
                queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
                queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
                setReviewingPaper(null);
                setPdfFile(null);
                showToast('✅ Paper published to Journals!');
            } catch (e: any) {
                setUploadError(e?.response?.data?.message || 'PDF upload failed');
            } finally {
                setUploading(false);
            }
        } else {
            reviewMutation.mutate({ id: reviewingPaper._id, status: reviewStatus, remarks: reviewRemarks });
        }
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/papers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'papers'] });
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Manage Papers</h1>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-[#E2E8F0] dark:border-[#374151] rounded-lg px-4 py-2 bg-white dark:bg-[#1F2937] text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]"
                >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="pre_proof">Pre-Proof (Awaiting Author)</option>
                    <option value="correction_requested">Correction Requested</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F1F5F9] dark:bg-[#1e293b] text-[#475569] dark:text-[#CBD5E1] uppercase text-xs tracking-wider border-b border-[#E2E8F0] dark:border-[#334155]">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-[30%]">Title</th>
                                <th className="px-6 py-4 font-semibold w-[10%]">Status</th>
                                <th className="px-6 py-4 font-semibold w-[20%]">Remarks</th>
                                <th className="px-6 py-4 font-semibold w-[20%]">Author</th>
                                <th className="px-6 py-4 font-semibold w-[10%]">Date</th>
                                <th className="px-6 py-4 font-semibold text-right w-[10%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#374151] text-[#0F172A] dark:text-[#F1F5F9]">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-8">Loading papers...</td></tr>
                            ) : papersData?.data?.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">No papers found.</td></tr>
                            ) : (
                                papersData?.data?.map(p => (
                                    <tr key={p._id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors align-top">
                                        <td className="px-6 py-4 font-medium break-all">{p.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                                p.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                                p.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                p.status === 'under_review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                                            }`}>
                                                {p.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#64748B] dark:text-[#94A3B8] text-xs italic break-words">
                                            {p.remarks || '-'}
                                        </td>
                                        <td className="px-6 py-4 break-words">
                                            {p.authors.map(a => a.split(' | ')[0].trim()).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 flex-wrap">
                                            {/* Review or Upload PDF button for all papers */}
                                            <Button size="sm" onClick={() => {
                                                setReviewingPaper(p);
                                                setReviewStatus(p.status);
                                                setReviewRemarks(p.remarks || '');
                                                setPdfFile(null);
                                                setCoverFile(null);
                                                setUploadError('');
                                            }} className={p.status === 'published'
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }>
                                                {p.status === 'published' ? 'Upload PDF' : 'Review'}
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => { if (confirm('Delete this paper forever?')) deleteMutation.mutate(p._id); }} className="p-2">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {reviewingPaper && (
                <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 md:p-8 w-full max-w-2xl shadow-2xl mt-12 mb-12">
                        {/* Header with status badge */}
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                                    {reviewingPaper.status === 'published' ? '📄 Manage Published Paper' :
                                     reviewingPaper.status === 'correction_requested' ? '✏️ Author Correction Received' :
                                     reviewingPaper.status === 'pre_proof' ? '🔍 Pre-Proof Stage' :
                                     reviewingPaper.status === 'payment_pending' ? '💳 Payment Pending' :
                                     'Review Paper'}
                                </h2>
                                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">{reviewingPaper.title}</p>
                            </div>
                            <span className={`shrink-0 ml-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${reviewingPaper.status === 'published' ? 'bg-green-100 text-green-700' :
                                  reviewingPaper.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  reviewingPaper.status === 'correction_requested' ? 'bg-orange-100 text-orange-700' :
                                  reviewingPaper.status === 'pre_proof' ? 'bg-purple-100 text-purple-700' :
                                  reviewingPaper.status === 'payment_pending' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'}`}>
                                {reviewingPaper.status.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* AUTHOR INFO — always visible */}
                            <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-lg p-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-3">Author Information</h3>
                                {(reviewingPaper as any).authors?.map((rawAuthor: string, i: number) => {
                                    const parts = rawAuthor.split(' | ');
                                    const [name, email, contact, address, designation] = parts;
                                    return (
                                        <div key={i} className="text-sm border-b border-[#E2E8F0] dark:border-[#374151] py-3 first:pt-0 last:border-0 last:pb-0">
                                            {name?.trim() && <p className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{name}</p>}
                                            {email && <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">✉ {email}</p>}
                                            {contact && <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">📞 {contact}</p>}
                                            {address && <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">📍 {address}</p>}
                                            {designation && <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">🏛 {designation}</p>}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* SUBMITTED MANUSCRIPT — always visible */}
                            {reviewingPaper.pdfUrl && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">Submitted Manuscript</p>
                                        <p className="text-sm text-amber-800 dark:text-amber-300 mt-0.5">Original Word/PDF from author</p>
                                    </div>
                                    <a href={reviewingPaper.pdfUrl} target="_blank" rel="noopener noreferrer"
                                        className="ml-4 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                        Download ↓
                                    </a>
                                </div>
                            )}

                            {/* COVER LETTER — only when exists */}
                            {(reviewingPaper as any).coverLetterUrl && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">Cover Letter</p>
                                        <p className="text-sm text-blue-800 dark:text-blue-300 mt-0.5">{(reviewingPaper as any).coverLetterName || 'cover_letter.docx'}</p>
                                    </div>
                                    <a href={(reviewingPaper as any).coverLetterUrl} download={(reviewingPaper as any).coverLetterName || 'cover_letter.docx'}
                                        className="ml-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                        Download ↓
                                    </a>
                                </div>
                            )}

                            {/* HIGHLIGHTS — only at early review stages */}
                            {(reviewingPaper as any).highlights && ['submitted','under_review','accepted'].includes(reviewingPaper.status) && (
                                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Highlights</h3>
                                    <p className="text-sm text-teal-900 dark:text-teal-100 whitespace-pre-wrap">{(reviewingPaper as any).highlights}</p>
                                </div>
                            )}

                            {/* KEYWORDS — only at early review stages */}
                            {(reviewingPaper as any).keywords?.length > 0 && ['submitted','under_review','accepted'].includes(reviewingPaper.status) && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-2">Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(reviewingPaper as any).keywords.map((kw: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* REVIEWER LIST — only at submitted / under_review */}
                            {(reviewingPaper as any).reviewers?.length > 0 && ['submitted','under_review'].includes(reviewingPaper.status) && (
                                <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-lg p-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">Suggested Reviewers</h3>
                                    <div className="space-y-3">
                                        {(reviewingPaper as any).reviewers.map((r: any, i: number) => (
                                            <div key={i} className="text-sm border-b border-[#E2E8F0] dark:border-[#374151] pb-3 last:border-0 last:pb-0">
                                                <p className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{r.name}</p>
                                                {r.designation && <p className="text-[#64748B]">💼 {r.designation}</p>}
                                                {r.affiliation && <p className="text-[#64748B]">🏛 {r.affiliation}</p>}
                                                {r.email && <p className="text-[#64748B]">✉ {r.email}</p>}
                                                {r.contact && <p className="text-[#64748B]">📞 {r.contact}</p>}
                                                {r.researchArea && <p className="text-[#64748B]">🔬 {r.researchArea}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AUTHOR CORRECTION NOTES — only when correction_requested */}
                            {reviewingPaper.status === 'correction_requested' && (reviewingPaper as any).authorCorrectionNotes && (
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 mb-2">Author's Correction Notes</h3>
                                    <p className="text-sm text-orange-900 dark:text-orange-100 whitespace-pre-wrap mb-3">{(reviewingPaper as any).authorCorrectionNotes}</p>
                                    {(reviewingPaper as any).authorCorrectionFileUrl && (
                                        <a href={(reviewingPaper as any).authorCorrectionFileUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                            Download Corrected File ↓
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* SEND CORRECTION FILE — only for active correction stages */}
                            {['submitted','under_review','accepted','pre_proof','correction_requested','awaiting_author_response'].includes(reviewingPaper.status) && (
                                <div className="border border-[#E2E8F0] dark:border-[#374151] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Send Correction File to Author</p>
                                        <div className="flex gap-1 text-xs">
                                            <button type="button" onClick={() => { setCorrectionMode('image'); setCorrectionFiles([]); }}
                                                className={`px-2.5 py-1 rounded-l-md border font-medium transition-colors ${correctionMode === 'image' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-[#1F2937] text-[#64748B] border-[#E2E8F0] dark:border-[#374151]'}`}>
                                                🖼 Images (max 5)
                                            </button>
                                            <button type="button" onClick={() => { setCorrectionMode('document'); setCorrectionFiles([]); }}
                                                className={`px-2.5 py-1 rounded-r-md border font-medium transition-colors ${correctionMode === 'document' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-[#1F2937] text-[#64748B] border-[#E2E8F0] dark:border-[#374151]'}`}>
                                                📄 Document
                                            </button>
                                        </div>
                                    </div>
                                    {reviewingPaper.correctionFiles && reviewingPaper.correctionFiles.length > 0 && (
                                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-2">
                                            Already sent: <span className="font-medium text-indigo-600 dark:text-indigo-400">{reviewingPaper.correctionFiles.length} file(s)</span>
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <input key={correctionMode} type="file"
                                            accept={correctionMode === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                                            multiple={correctionMode === 'image'}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (correctionMode === 'image' && files.length > 5) { setCorrectionError('Max 5 images allowed'); setCorrectionFiles([]); }
                                                else { setCorrectionFiles(correctionMode === 'document' ? files.slice(0, 1) : files); setCorrectionSuccess(false); setCorrectionError(''); }
                                            }}
                                            className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" />
                                        <button type="button" disabled={correctionFiles.length === 0 || correctionUploading}
                                            onClick={handleSendCorrectionFile}
                                            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                                            {correctionUploading ? 'Sending...' : 'Send to Author'}
                                        </button>
                                    </div>
                                    {correctionFiles.length > 0 && (
                                        <ul className="mt-1 space-y-0.5">{correctionFiles.map((f, i) => <li key={i} className="text-xs text-indigo-600 dark:text-indigo-400">• {f.name}</li>)}</ul>
                                    )}
                                    {correctionSuccess && <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Files sent successfully!</p>}
                                    {correctionError && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{correctionError}</p>}
                                </div>
                            )}

                            {/* STATUS CHANGE — not shown for published papers */}
                            {reviewingPaper.status !== 'published' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#0F172A] dark:text-[#F1F5F9]">Update Status</label>
                                    <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
                                        className="w-full border border-[#E2E8F0] dark:border-[#374151] rounded-lg px-3 py-2 bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F1F5F9]">
                                        {['submitted','under_review'].includes(reviewingPaper.status) && <>
                                            <option value="submitted">Submitted</option>
                                            <option value="under_review">Under Review</option>
                                            <option value="correction_requested">Correction Requested</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </>}
                                        {reviewingPaper.status === 'accepted' && <>
                                            <option value="accepted">Accepted</option>
                                            <option value="pre_proof">Send Pre-Proof to Author</option>
                                            <option value="correction_requested">Correction Requested</option>
                                            <option value="rejected">Rejected</option>
                                        </>}
                                        {['pre_proof','correction_requested','awaiting_author_response'].includes(reviewingPaper.status) && <>
                                            <option value="pre_proof">Pre-Proof</option>
                                            <option value="correction_requested">Correction Requested</option>
                                            <option value="payment_pending">Payment Pending</option>
                                        </>}
                                        {['payment_pending','payment_completed'].includes(reviewingPaper.status) && <>
                                            <option value="payment_pending">Payment Pending</option>
                                            <option value="payment_completed">Payment Completed</option>
                                            <option value="published">Published (Skip Payment)</option>
                                        </>}
                                        {reviewingPaper.status === 'rejected' && <>
                                            <option value="rejected">Rejected</option>
                                            <option value="submitted">Reopen (Submitted)</option>
                                        </>}
                                    </select>
                                </div>
                            )}

                            {/* FORMATTED PDF UPLOAD — only when moving to published or pre_proof, or paper is already published */}
                            {(reviewStatus === 'published' || reviewStatus === 'pre_proof' || reviewingPaper.status === 'published') && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <label className="block text-sm font-bold text-green-800 dark:text-green-300 mb-3">
                                        Upload Formatted PDF <span className="font-normal text-green-600">(for public journal page)</span>
                                    </label>
                                    <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer mb-2" />
                                    {pdfFile ? <p className="text-sm font-medium text-green-700 dark:text-green-400">✓ {pdfFile.name} selected</p>
                                             : <p className="text-xs text-amber-600 dark:text-amber-400">⚠ Without a PDF, paper will be published but no file shown publicly.</p>}
                                </div>
                            )}

                            {/* COVER IMAGE — only for published papers */}
                            {reviewingPaper.status === 'published' && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                    <label className="block text-sm font-bold text-purple-800 dark:text-purple-300 mb-3">Upload Cover Image / Logo</label>
                                    <div className="flex gap-3 flex-wrap">
                                        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                            className="w-full sm:w-auto text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer" />
                                        <Button type="button" onClick={handleCoverUpload} disabled={!coverFile || coverUploading}
                                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">
                                            {coverUploading ? 'Uploading...' : 'Upload Cover'}
                                        </Button>
                                    </div>
                                    {reviewingPaper.coverImage && <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">✓ Cover image is set</p>}
                                </div>
                            )}

                            {/* MEMBERSHIP TOGGLE — only for published papers */}
                            {reviewingPaper.status === 'published' && (
                                <div className="border border-[#E2E8F0] dark:border-[#374151] rounded-lg p-4">
                                    <label className="flex items-center cursor-pointer gap-3">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only peer"
                                                checked={!!(reviewingPaper as any).requiresMembership}
                                                onChange={(e) => {
                                                    const newValue = e.target.checked;
                                                    setReviewingPaper((prev: any) => prev ? { ...prev, requiresMembership: newValue } : null);
                                                    togglePaperMembershipMutation.mutate({ id: reviewingPaper._id, requiresMembership: newValue });
                                                }} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D7C66]/30 dark:peer-focus:ring-[#0D7C66]/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D7C66]"></div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Require Membership to View</p>
                                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Non-members will see a blurred locked preview.</p>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {/* REMARKS — always visible */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#0F172A] dark:text-[#F1F5F9]">Remarks <span className="text-[#94A3B8] font-normal">(visible to author)</span></label>
                                <textarea value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)}
                                    className="w-full border border-[#E2E8F0] dark:border-[#374151] rounded-lg px-3 py-2 h-24 bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F1F5F9]"
                                    placeholder="Provide feedback to the author..." />
                            </div>

                            {uploadError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{uploadError}</p>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => { setReviewingPaper(null); setPdfFile(null); setCoverFile(null); setUploadError(''); setCorrectionFiles([]); setCorrectionSuccess(false); setCorrectionError(''); }}>Cancel</Button>
                            <Button onClick={handleSaveReview} disabled={reviewMutation.isPending || uploading} className="bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                                {uploading ? 'Uploading PDF...' : reviewMutation.isPending ? 'Saving...' :
                                    reviewingPaper.status === 'published' ? (pdfFile ? 'Upload PDF' : 'Save Changes') : 'Save Review'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}

            {successToast && (
                <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#0D7C66] text-white px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">{successToast}</span>
                </div>
            )}
        </div>
    );
}
