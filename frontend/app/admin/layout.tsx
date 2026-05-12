'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                router.push('/');
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center ">
                <div className="w-12 h-12 border-4 border-[#0D7C66] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  flex">
            <AdminSidebar className="w-64 flex-shrink-0 sticky top-0 h-screen" />
            <main className="flex-1 overflow-auto bg-white dark:bg-[#111827] shadow-sm rounded-l-2xl my-4 mr-4 p-8 border border-[#E2E8F0] dark:border-[#1F2937] ml-4 md:ml-0">
                {children}
            </main>
        </div>
    );
}
