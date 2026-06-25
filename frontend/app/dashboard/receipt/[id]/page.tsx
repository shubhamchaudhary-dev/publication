'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptPage() {
    const params = useParams();
    const id = params.id as string;
    const [receipt, setReceipt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const { data } = await api.get(`/api/payments/receipt/${id}`);
                setReceipt(data.data);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to load receipt or payment not completed.');
            } finally {
                setLoading(false);
            }
        };
        fetchReceipt();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Receipt Unavailable</h1>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link href="/dashboard" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 print:bg-white print:py-0">
            {/* Non-printable controls */}
            <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
            </div>

            {/* Printable Receipt */}
            <div className="max-w-3xl mx-auto bg-white p-10 md:p-14 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">SwarnPublication</h1>
                        <p className="text-gray-500 mt-1">Academic Publishing Platform</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-bold text-indigo-600 tracking-tighter uppercase opacity-20 print:opacity-100 print:text-gray-900">Receipt</h2>
                        <p className="text-gray-500 font-medium mt-2">#{receipt.razorpayPaymentId || receipt._id}</p>
                        <p className="text-gray-500 font-medium">{new Date(receipt.paidAt || receipt.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Billed To</h3>
                        <p className="font-semibold text-gray-900 text-lg">{receipt.authorId?.name}</p>
                        <p className="text-gray-600">{receipt.authorId?.email}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Payment Info</h3>
                        <p className="font-medium text-gray-900">Method: <span className="font-normal text-gray-600">Razorpay Secure Checkout</span></p>
                        <p className="font-medium text-gray-900">Status: <span className="font-bold text-emerald-600">PAID</span></p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="py-3 text-sm font-bold text-gray-900 uppercase tracking-wider">Description</th>
                                <th className="py-3 text-sm font-bold text-gray-900 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-6">
                                    <p className="font-semibold text-gray-900 text-lg">Publication Fee</p>
                                    <p className="text-gray-500 mt-1">Paper: <span className="italic">{receipt.paperId?.title}</span></p>
                                </td>
                                <td className="py-6 text-right font-medium text-gray-900 text-lg">
                                    {receipt.currency} {receipt.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="flex justify-end mb-16">
                    <div className="w-full max-w-sm">
                        <div className="flex justify-between items-center py-4 border-t-2 border-gray-900 mt-2">
                            <span className="text-xl font-bold text-gray-900">Total Paid</span>
                            <span className="text-3xl font-bold text-gray-900">
                                {receipt.currency} {receipt.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
                    <p className="mb-2">Thank you for publishing your research with SwarnPublication.</p>
                    <p>If you have any questions regarding this receipt, please contact <a href="mailto:support@swarnpublication.com" className="text-indigo-600 font-medium">support@swarnpublication.com</a></p>
                </div>
            </div>
            
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
                }
            `}</style>
        </div>
    );
}
