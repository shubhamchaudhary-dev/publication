'use client';
import { useState, useEffect } from 'react';
import { Trash2, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

interface Feedback {
  _id: string;
  name?: string;
  email?: string;
  feedbackType: string;
  message: string;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get('/api/feedback');
      setFeedbackList(res.data);
    } catch (err: any) {
      setError('Failed to fetch feedback.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await api.delete(`/api/feedback/${id}`);
      setFeedbackList(feedbackList.filter(fb => fb._id !== id));
    } catch (err: any) {
      alert('Failed to delete feedback');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0055A4]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#0055A4]" />
          User Feedback
        </h1>
        <p className="text-[#64748B] mt-2">Manage feedback and suggestions submitted by users.</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#1F2937] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
              {feedbackList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#64748B]">
                    No feedback received yet.
                  </td>
                </tr>
              ) : (
                feedbackList.map((fb) => (
                  <tr key={fb._id} className="hover:bg-gray-50 dark:hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475569] dark:text-[#94A3B8]">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        fb.feedbackType === 'Bug Report' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        fb.feedbackType === 'Feature Request' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {fb.feedbackType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                        {fb.name || 'Anonymous'}
                      </div>
                      {fb.email && (
                        <div className="text-sm text-[#64748B]">
                          <a href={`mailto:${fb.email}`} className="hover:underline">{fb.email}</a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#94A3B8] max-w-md">
                      {fb.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(fb._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
