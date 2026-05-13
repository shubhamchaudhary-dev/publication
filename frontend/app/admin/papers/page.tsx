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
    // Correction files state (images: up to 5, document: 1)
    const [correctionFiles, setCorrectionFiles] = useState<File[]>([]);
    const [correctionUploading, setCorrectionUploading] = useState(false);
    const [correctionError, setCorrectionError] = useState('');
    const [correctionSuccess, setCorrectionSuccess] = useState(false);
    const [correctionMode, setCorrectionMode] = useState<'image' | 'document'>('document');

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
            setUploadError('');
            showToast('Review saved successfully.');
        }
    });

    const handleSaveReview = async () => {
        if (!reviewingPaper) return;
        setUploadError('');

        // If status is published AND a PDF file was selected, upload it
        if (reviewStatus === 'published' && pdfFile) {
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
                if (reviewRemarks) {
                    await api.put(`/api/admin/papers/${reviewingPaper._id}/review`, { status: 'published', remarks: reviewRemarks });
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
                    <option value="rejected">Rejected</option>
                    <option value="published">Published</option>
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
                                        <td className="px-6 py-4 font-medium break-words">{p.title}</td>
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-2xl shadow-2xl my-8">
                        <h2 className="text-xl font-bold mb-1 text-[#0F172A] dark:text-[#F1F5F9]">
                            {reviewingPaper.status === 'published' ? '📄 Upload Published PDF' : 'Review Paper'}
                        </h2>
                        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-5 font-medium">{reviewingPaper.title}</p>

                        {/* Author Details — CMS only */}
                        <div className="mb-5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#374151] rounded-lg p-4 overflow-hidden">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-3">Author Information (CMS Only)</h3>
                            <div className="space-y-3">
                                {(reviewingPaper as any).authors?.map((rawAuthor: string, i: number) => {
                                    const parts = rawAuthor.split(' | ');
                                    const [name, email, contact, address, designation] = parts;
                                    return (
                                        <div key={i} className="text-sm border-b border-[#E2E8F0] dark:border-[#374151] pb-3 last:border-0 last:pb-0 min-w-0">
                                            <p className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] break-words">{name || rawAuthor}</p>
                                            {email && <p className="text-[#64748B] dark:text-[#94A3B8] break-all">✉ {email}</p>}
                                            {contact && <p className="text-[#64748B] dark:text-[#94A3B8] break-words">📞 {contact}</p>}
                                            {address && <p className="text-[#64748B] dark:text-[#94A3B8] break-words">📍 {address}</p>}
                                            {designation && <p className="text-[#64748B] dark:text-[#94A3B8] break-words">🏛 {designation}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Original submitted Word file */}
                            {reviewingPaper.pdfUrl && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">Submitted Manuscript</p>
                                        <p className="text-sm text-amber-800 dark:text-amber-300 mt-0.5">Original Word/PDF file from author</p>
                                    </div>
                                    <a
                                        href={reviewingPaper.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-4 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        Download ↓
                                    </a>
                                </div>
                            )}

                            {/* For published papers: skip status change, just upload PDF */}
                            {reviewingPaper.status !== 'published' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#0F172A] dark:text-[#F1F5F9]">Update Status</label>
                                    <select
                                        value={reviewStatus}
                                        onChange={(e) => setReviewStatus(e.target.value)}
                                        className="w-full border border-[#E2E8F0] dark:border-[#374151] rounded-lg px-3 py-2 bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F1F5F9]"
                                    >
                                        <option value="submitted">Submitted</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="published">Published (Approved)</option>
                                    </select>
                                </div>
                            )}

                            {/* PDF Upload — only when marking as Published */}
                            {reviewStatus === 'published' && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <label className="block text-sm font-bold text-green-800 dark:text-green-300 mb-1">
                                        Upload Formatted PDF <span className="font-normal text-green-600 dark:text-green-400">(required for public journal page)</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-[#0F172A] dark:text-[#F1F5F9] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                                    />
                                    {pdfFile && (
                                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">✓ {pdfFile.name} selected</p>
                                    )}
                                    {!pdfFile && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">⚠ Without a PDF, the paper will be marked published but no PDF will be shown publicly.</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#0F172A] dark:text-[#F1F5F9]">Remarks <span className="text-[#94A3B8] font-normal">(visible to author)</span></label>
                                <textarea
                                    value={reviewRemarks}
                                    onChange={(e) => setReviewRemarks(e.target.value)}
                                    className="w-full border border-[#E2E8F0] dark:border-[#374151] rounded-lg px-3 py-2 h-24 bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F1F5F9]"
                                    placeholder="Provide feedback or reasons for rejection..."
                                />
                            </div>

                            {uploadError && (
                                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{uploadError}</p>
                            )}

                            {/* Correction File Section — non-published papers only */}
                            {reviewingPaper.status !== 'published' && (
                                <div className="border-t border-[#E2E8F0] dark:border-[#374151] pt-4 mt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                                            Send Correction File
                                            <span className="ml-2 text-xs font-normal text-[#64748B]">(visible to author only)</span>
                                        </p>
                                        {/* Image / Document toggle */}
                                        <div className="flex gap-1 text-xs">
                                            <button type="button" onClick={() => { setCorrectionMode('image'); setCorrectionFiles([]); }}
                                                className={`px-2.5 py-1 rounded-l-md border font-medium transition-colors ${ correctionMode === 'image' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-[#1F2937] text-[#64748B] border-[#E2E8F0] dark:border-[#374151]' }`}>
                                                🖼 Images (max 5)
                                            </button>
                                            <button type="button" onClick={() => { setCorrectionMode('document'); setCorrectionFiles([]); }}
                                                className={`px-2.5 py-1 rounded-r-md border font-medium transition-colors ${ correctionMode === 'document' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-[#1F2937] text-[#64748B] border-[#E2E8F0] dark:border-[#374151]' }`}>
                                                📄 Document
                                            </button>
                                        </div>
                                    </div>

                                    {/* Show currently sent files */}
                                    {reviewingPaper.correctionFiles && reviewingPaper.correctionFiles.length > 0 && (
                                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-2">
                                            Currently sent: <span className="font-medium text-indigo-600 dark:text-indigo-400">{reviewingPaper.correctionFiles.length} file(s)</span>
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <input
                                            key={correctionMode}
                                            type="file"
                                            accept={correctionMode === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                                            multiple={correctionMode === 'image'}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (correctionMode === 'image' && files.length > 5) {
                                                    setCorrectionError('Max 5 images allowed');
                                                    setCorrectionFiles([]);
                                                } else {
                                                    setCorrectionFiles(correctionMode === 'document' ? files.slice(0, 1) : files);
                                                    setCorrectionSuccess(false);
                                                    setCorrectionError('');
                                                }
                                            }}
                                            className="text-sm text-[#0F172A] dark:text-[#F1F5F9] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                                        />
                                        <button
                                            type="button"
                                            disabled={correctionFiles.length === 0 || correctionUploading}
                                            onClick={handleSendCorrectionFile}
                                            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                                        >
                                            {correctionUploading ? 'Sending...' : 'Send to Author'}
                                        </button>
                                    </div>
                                    {correctionFiles.length > 0 && (
                                        <ul className="mt-1 space-y-0.5">
                                            {correctionFiles.map((f, i) => (
                                                <li key={i} className="text-xs text-indigo-600 dark:text-indigo-400">• {f.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {correctionSuccess && <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Files sent successfully!</p>}
                                    {correctionError && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{correctionError}</p>}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => { setReviewingPaper(null); setPdfFile(null); setUploadError(''); setCorrectionFiles([]); setCorrectionSuccess(false); setCorrectionError(''); }}>Cancel</Button>
                            <Button
                                onClick={handleSaveReview}
                                disabled={reviewMutation.isPending || uploading}
                                className="bg-[#0D7C66] hover:bg-[#0a6655] text-white"
                            >
                                {uploading ? 'Uploading PDF...' : reviewMutation.isPending ? 'Saving...' :
                                    reviewingPaper.status === 'published' ? (pdfFile ? 'Upload PDF' : 'Save Remarks') : 'Save Review'
                                }
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
