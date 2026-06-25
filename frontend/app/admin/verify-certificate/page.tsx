'use client';
import { useState } from 'react';
import { Award, Search, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

interface VerificationResult {
    paperTitle: string;
    journalName: string;
    publishedAt: string;
    authorName: string;
    certId: string;
    pdfUrl: string;
}

export default function VerifyCertificatePage() {
    const [certId, setCertId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!certId.trim()) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await api.get(`/api/admin/verify-certificate/${certId.trim()}`);
            setResult(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Invalid Certificate ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Certificate</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Enter a Certificate ID below to verify its authenticity and view the details of the published author.
            </p>

            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <form onSubmit={handleVerify} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="e.g. SP-2026-A1B2C3D4"
                            value={certId}
                            onChange={(e) => setCertId(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#0EA5A4] outline-none transition-all text-gray-900 dark:text-white uppercase"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !certId.trim()}
                        className="px-6 py-3 bg-[#0EA5A4] hover:bg-[#0d8c8b] disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
                    >
                        {loading ? 'Verifying...' : 'Verify Now'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 animate-in fade-in flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Invalid Certificate</h3>
                        <p className="text-red-700 dark:text-red-300/80 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="bg-gradient-to-br from-[#F8FAFC] to-white dark:from-[#0F172A] dark:to-[#1E293B] border border-gray-200 dark:border-white/10 rounded-2xl p-8 animate-in fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 dark:bg-green-500/5 rounded-bl-full -z-0" />
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-4 border-white dark:border-[#1E293B] shadow-md">
                            <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Authentic Certificate</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                <Award className="w-4 h-4" /> ID: {result.certId}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Author Name</span>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{result.authorName}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Published Date</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {new Date(result.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paper Title</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{result.paperTitle}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Journal</span>
                            <p className="font-medium text-[#0EA5A4]">{result.journalName}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex justify-end relative z-10">
                        <a
                            href={result.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-xl transition-colors shadow-sm"
                        >
                            <Award className="w-4 h-4" />
                            View Certificate Document
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}