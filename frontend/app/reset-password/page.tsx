'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      setStatus('loading');
      await api.post('/api/auth/reset-password', { token, newPassword });
      setStatus('success');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. The token may be expired or invalid.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0A0A] flex flex-col justify-center items-center p-6" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1A3C5E] dark:text-white font-bold text-xl font-serif mb-2">
            <BookOpen className="w-6 h-6 text-[#0D7C66]" /> SwapanPublication
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-2">Set new password</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">Please enter your new password below.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-2">Password Reset Successful</p>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">Your password has been changed successfully. Redirecting you to login...</p>
            <Link href="/login" className="text-[#0D7C66] font-medium hover:underline text-sm flex items-center justify-center gap-2">
               Go to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-1">New password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-10 rounded-md border border-[#E2E8F0] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent dark:text-white transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={!token}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-1">Confirm password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-10 rounded-md border border-[#E2E8F0] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent dark:text-white transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={!token}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !token || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center h-10 px-4 bg-[#0D7C66] hover:bg-[#0a6655] text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</> : 'Reset password'}
            </button>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#0D7C66] dark:hover:text-[#0D7C66] text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
