'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fetchMe } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('swarn_token', token);
            fetchMe().then(() => {
                router.replace('/dashboard');
            });
        } else {
            router.replace('/login?error=auth_failed');
        }
    }, [searchParams, fetchMe, router]);

    return (
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#0D7C66]" />
            <p className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">Completing sign in...</p>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <div className="min-h-screen  flex items-center justify-center flex-col gap-4">
            <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-[#0D7C66]" />}>
                <CallbackContent />
            </Suspense>
        </div>
    );
}
