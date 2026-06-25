'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, Lock } from 'lucide-react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['reader', 'researcher']),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const [otpSentTo, setOtpSentTo] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'reader' }
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await api.post('/api/auth/register', data);
      setOtpSentTo(data.email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);
    try {
      const res = await api.post('/api/auth/verify-otp', { email: otpSentTo, otp });
      const { token, user } = res.data.data;
      const { setAuth } = useAuthStore.getState();
      setAuth(user, token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || message);
    } finally {
      setIsVerifying(false);
    }
  };

  const googleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1A3C5E] dark:text-white font-bold text-xl font-serif mb-2">
            <BookOpen className="w-6 h-6 text-[#0D7C66]" /> SwapanPublication
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-2">Create an account</h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">Join as a reader or researcher</p>
        </div>

        {otpSentTo ? (
          <div>
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
              <div className="bg-[#0D7C66]/10 p-4 rounded-full text-[#0D7C66]">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Verify your email</h2>
              <p className="text-sm text-[#4B5563] dark:text-[#94A3B8]">
                We sent a 6-digit verification code to <br />
                <span className="font-semibold text-black dark:text-white">{otpSentTo}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  className="mt-2 text-center tracking-[0.5em] font-bold text-xl h-14"
                  placeholder="123456"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mt-2">{error}</p>}
              <Button type="submit" disabled={isVerifying || otp.length < 6} className="w-full mt-4 bg-[#0D7C66] hover:bg-[#0a6655] text-white py-6">
                {isVerifying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : 'Verify & Continue'}
              </Button>

              <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8] mt-6">
                Didn't get the email? Check your spam folder.
              </p>
            </form>
          </div>
        ) : (
          <>
            <button
              onClick={googleSignup}
              className="w-full flex items-center justify-center gap-3 border border-[#E2E8F0] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#0F172A] dark:text-[#F1F5F9] rounded-lg py-2.5 text-sm font-medium hover:bg-[#F8FAFC] dark:hover:bg-[#374151] transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Sign up with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0] dark:border-[#374151]" /></div>
              <div className="relative flex justify-center text-xs text-[#64748B] dark:text-[#94A3B8]"><span className="px-3 bg-white dark:bg-[#111827]">or sign up with email</span></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} className="mt-1" placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} className="mt-1" placeholder="you@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} className="mt-1" placeholder="••••••••" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div className="pt-2">
                <Label className="mb-2 block">I am a...</Label>
                <div className="flex gap-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value="reader" {...register('role')} className="w-4 h-4 text-[#0D7C66] border-gray-300 focus:ring-[#0D7C66]" />
                    <span className="text-sm font-normal text-[#0F172A] dark:text-[#F1F5F9]">Reader</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value="researcher" {...register('role')} className="w-4 h-4 text-[#0D7C66] border-gray-300 focus:ring-[#0D7C66]" />
                    <span className="text-sm font-normal text-[#0F172A] dark:text-[#F1F5F9]">Researcher</span>
                  </label>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mt-2">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</> : 'Sign Up'}
              </Button>
            </form>

            <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8] mt-6">
              Already have an account? <Link href="/login" className="text-[#0D7C66] hover:underline font-medium">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
