'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { 
    BookOpen, User as UserIcon, LogOut, Edit, Trash2, 
    LayoutDashboard, FileText, Send, CheckCircle, Award, 
    HelpCircle, UserCheck, X, MessageSquare 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaperCard, { Paper } from '@/components/PaperCard';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading: authLoading, logout, fetchMe } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'papers' | 'bookmarks' | 'profile' | 'submissions' | 'published' | 'certificates' | 'support'>('dashboard');
    const [showSuccess, setShowSuccess] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [certificateModalOpen, setCertificateModalOpen] = useState(false);
    const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
    const [correctionPaperId, setCorrectionPaperId] = useState('');
    const [correctionNotes, setCorrectionNotes] = useState('');
    const [correctionFile, setCorrectionFile] = useState<File | null>(null);
    const [isUploadingCorrection, setIsUploadingCorrection] = useState(false);
    const [submitCorrectionPaperId, setSubmitCorrectionPaperId] = useState('');
    const [submitCorrectionFile, setSubmitCorrectionFile] = useState<File | null>(null);
    const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);
    const [preferences, setPreferences] = useState({
        reviewer: true,
        email: true,
        alerts: false
    });
    const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: user?.name || '',
            institution: user?.institution || '',
            phone: user?.phone || '',
            dob: user?.dob || '',
            gender: user?.gender || '',
            department: user?.department || '',
            designation: user?.designation || '',
            fieldOfResearch: user?.fieldOfResearch || '',
            researchInterests: user?.researchInterests || '',
            highestQualification: user?.highestQualification || '',
            orcid: user?.orcid || '',
            googleScholar: user?.googleScholar || '',
            linkedin: user?.linkedin || '',
            bio: user?.bio || '',
            country: user?.country || '',
            state: user?.state || '',
            city: user?.city || '',
        }
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Re-fetch user when certificates tab is opened to show latest data
    useEffect(() => {
        if (activeTab === 'certificates') {
            fetchMe();
        }
    }, [activeTab]);

    // Populate form fields whenever user data loads/changes (e.g. after page refresh)
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                institution: user.institution || '',
                phone: user.phone || '',
                dob: user.dob || '',
                gender: user.gender || '',
                department: user.department || '',
                designation: user.designation || '',
                fieldOfResearch: user.fieldOfResearch || '',
                researchInterests: user.researchInterests || '',
                highestQualification: user.highestQualification || '',
                orcid: user.orcid || '',
                googleScholar: user.googleScholar || '',
                linkedin: user.linkedin || '',
                bio: user.bio || '',
                country: user.country || '',
                state: user.state || '',
                city: user.city || '',
            });
            // Sync preferences toggles
            setPreferences({
                reviewer: user.availableAsReviewer ?? true,
                email: user.emailNotifications ?? true,
                alerts: user.newIssueAlerts ?? false,
            });
        }
    }, [user, reset]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('tab') === 'papers') {
                setActiveTab('papers');
            }
            if (params.get('success') === 'true') {
                setShowSuccess(true);
                window.history.replaceState({}, '', '/dashboard');
                setTimeout(() => setShowSuccess(false), 5000);
            }
        }
        if (user) {
            reset({
                name: user.name,
                institution: user.institution || '',
                phone: user.phone || '',
                dob: user.dob || '',
                gender: user.gender || '',
                department: user.department || '',
                designation: user.designation || '',
                fieldOfResearch: user.fieldOfResearch || '',
                researchInterests: user.researchInterests || '',
                highestQualification: user.highestQualification || '',
                orcid: user.orcid || '',
                googleScholar: user.googleScholar || '',
                linkedin: user.linkedin || '',
                bio: user.bio || '',
                country: user.country || '',
                state: user.state || '',
                city: user.city || '',
            });
            setPreferences({
                reviewer: user.availableAsReviewer ?? true,
                email: user.emailNotifications ?? true,
                alerts: user.newIssueAlerts ?? false
            });
        }
    }, [user, reset]);

    const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery<{ data: { paperId: Paper }[] }>({
        queryKey: ['bookmarks'],
        queryFn: async () => (await api.get('/api/bookmarks')).data,
        enabled: isAuthenticated,
    });

    const { data: myPapersData, isLoading: papersLoading } = useQuery<{ data: Paper[] }>({
        queryKey: ['papers', 'me'],
        queryFn: async () => (await api.get('/api/papers/me')).data,
        enabled: isAuthenticated && !!user,
    });

    const { data: paymentsData, isLoading: paymentsLoading } = useQuery<{ data: any[] }>({
        queryKey: ['payments', 'history'],
        queryFn: async () => (await api.get('/api/payments/history')).data,
        enabled: isAuthenticated && !!user,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.put('/api/users/me', data);
        },
        onSuccess: () => {
            fetchMe(); // Re-fetch full user profile so the form stays populated
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    });

    const deletePaperMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/papers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers', 'me'] });
        }
    });

    const approveProofMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/api/papers/${id}/approve-proof`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers', 'me'] });
            alert('Proof approved successfully!');
        }
    });

    const requestCorrectionMutation = useMutation({
        mutationFn: async ({ id, notes, fileBase64, fileName }: { id: string, notes: string, fileBase64?: string, fileName?: string }) => {
            await api.post(`/api/papers/${id}/request-correction`, { correctionNotes: notes, correctionFileBase64: fileBase64, correctionFileName: fileName });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers', 'me'] });
            setCorrectionModalOpen(false);
            setCorrectionNotes('');
            setCorrectionFile(null);
            alert('Correction requested successfully.');
        },
        onError: (err: any) => {
            alert(err?.response?.data?.message || 'Failed to request correction');
        }
    });

    const submitCorrectionMutation = useMutation({
        mutationFn: async ({ id, fileBase64 }: { id: string, fileBase64: string }) => {
            await api.post(`/api/papers/${id}/submit-correction`, { correctionFileBase64: fileBase64 });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['papers', 'me'] });
            alert('Correction submitted successfully. Your paper is back under review.');
        },
        onError: (err: any) => {
            alert(err?.response?.data?.message || 'Failed to submit correction');
        }
    });

    const handleSubmitCorrection = async () => {
        if (!submitCorrectionPaperId || !submitCorrectionFile) return;
        setIsSubmittingCorrection(true);
        try {
            const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });
            const base64 = await toBase64(submitCorrectionFile);
            await submitCorrectionMutation.mutateAsync({ id: submitCorrectionPaperId, fileBase64: base64 });
            setSubmitCorrectionFile(null);
            setSubmitCorrectionPaperId('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingCorrection(false);
        }
    };

    const handlePayment = async (paperId: string) => {
        try {
            const { data: orderData } = await api.post('/api/payments/create-order', { paperId });
            
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Publication Fee',
                description: 'Payment for paper publication',
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        await api.post('/api/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paperId
                        });
                        queryClient.invalidateQueries({ queryKey: ['papers', 'me'] });
                        alert('Payment successful! Your paper will be published shortly.');
                    } catch (err) {
                        console.error('Payment verification failed', err);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                theme: {
                    color: '#0EA5A4'
                }
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(response.error.description);
            });
            rzp.open();
        } catch (error: any) {
            console.error('Failed to create order', error);
            const msg = error?.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to initiate payment: ${msg}. Please try again.`);
        }
    };

    if (authLoading || !isAuthenticated) return null;

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'papers', label: 'My Papers', icon: FileText },
        { id: 'submissions', label: 'Submissions', icon: Send },
        { id: 'published', label: 'Published Papers', icon: CheckCircle },
        { id: 'bookmarks', label: 'Bookmarks', icon: BookOpen },
        { id: 'profile', label: 'Profile Settings', icon: UserIcon },
    ];

    // Dynamic data for the dashboard
    const stats = [
        { label: 'Total Papers', value: myPapersData?.data?.length || 0, color: 'from-blue-500 to-indigo-600' },
        { label: 'Under Review', value: myPapersData?.data?.filter((p: Paper) => p.status === 'under_review').length || 0, color: 'from-amber-500 to-orange-500' },
        { label: 'Published', value: myPapersData?.data?.filter((p: Paper) => p.status === 'published').length || 0, color: 'from-emerald-400 to-emerald-600' },
    ];

    const timeline = myPapersData?.data?.slice(0, 4).map((paper: Paper) => ({
        date: new Date(paper.createdAt).toLocaleDateString(),
        title: `Status: ${paper.status.replace('_', ' ').toUpperCase()}`,
        desc: paper.title
    })) || [];

    // Calculate current pipeline stage based on the most recent paper
    const latestPaper = myPapersData?.data?.[0];
    let currentStageIndex = 0; // Default Submitted
    if (latestPaper) {
        const s = latestPaper.status;
        if (s === 'draft' || s === 'submitted') currentStageIndex = 0;
        else if (s === 'under_review' || s === 'rejected') currentStageIndex = 1;
        else if (['accepted', 'pre_proof', 'awaiting_author_response', 'correction_requested'].includes(s)) currentStageIndex = 2;
        else if (['final_approval', 'payment_pending'].includes(s)) currentStageIndex = 3;
        else if (['payment_completed', 'published'].includes(s)) currentStageIndex = 4;
    }

    // Calculate Profile Completion — based on real fields
    const profileFields = [
        { key: 'name', label: 'Full Name', weight: 15 },
        { key: 'institution', label: 'Institution', weight: 15 },
        { key: 'phone', label: 'Phone Number', weight: 10 },
        { key: 'department', label: 'Department', weight: 10 },
        { key: 'fieldOfResearch', label: 'Field of Research', weight: 10 },
        { key: 'bio', label: 'Short Bio', weight: 10 },
        { key: 'googleScholar', label: 'Google Scholar', weight: 10 },
        { key: 'linkedin', label: 'LinkedIn', weight: 10 },
        { key: 'country', label: 'Country', weight: 5 },
        { key: 'avatarUrl', label: 'Profile Photo', weight: 5 },
    ] as { key: keyof typeof user; label: string; weight: number }[];
    const profileCompletion = user
        ? profileFields.reduce((acc, f) => acc + ((user as any)[f.key] ? f.weight : 0), 0)
        : 0;
    const missingFields = user ? profileFields.filter(f => !(user as any)[f.key]) : [];

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A]">
            <Navbar />

            {/* Mobile: horizontal scrollable tab bar */}
            <div className="lg:hidden w-full max-w-[100vw] overflow-x-auto bg-white dark:bg-[#1E293B] border-b border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-1 px-3 py-2 min-w-max">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                                activeTab === item.id
                                    ? 'bg-[#0EA5A4] text-white'
                                    : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <item.icon className="w-3.5 h-3.5" aria-hidden="true" />
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={logout}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all whitespace-nowrap min-h-[40px]"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Premium Sidebar — desktop only */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-[#0F172A]/5 border border-white/20 dark:border-white/5 overflow-hidden sticky top-24">
                        <div className="px-5 pt-5 pb-4 text-center bg-gradient-to-b from-[#0EA5A4]/10 to-transparent">
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 shadow-lg shadow-[#0EA5A4]/30 ring-4 ring-white dark:ring-[#1E293B] overflow-hidden shrink-0">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-[#0EA5A4] to-[#22C55E] text-white flex items-center justify-center text-2xl font-bold select-none">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h2 className="font-bold text-sm text-[#0F172A] dark:text-[#F1F5F9] truncate max-w-full">{user?.name}</h2>
                            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mb-3 truncate max-w-full">{user?.email}</p>
                            <div className="inline-flex items-center gap-1.5 bg-[#0F172A] dark:bg-white/10 px-3 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                                <UserCheck className="w-3 h-3" /> {user?.role}
                            </div>
                        </div>
                        <nav className="p-3 space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeTab === item.id 
                                        ? 'bg-[#0EA5A4] text-white shadow-md shadow-[#0EA5A4]/20 translate-x-1' 
                                        : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#0F172A] dark:hover:text-white'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-[#94A3B8]'}`} /> 
                                    {item.label}
                                </button>
                            ))}
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 transition-all duration-200"
                                >
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    {/* Top Welcome Banner */}
                    <div className="bg-gradient-to-br from-white via-[#F0FDFA] to-[#F0F9FF] dark:from-[#1E293B] dark:via-[#1E293B] dark:to-[#0F172A] rounded-2xl p-6 md:p-8 text-[#0F172A] dark:text-white shadow-sm border border-[#E2E8F0] dark:border-white/10 mb-6 relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0EA5A4] rounded-full blur-[80px] opacity-[0.15] group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Welcome Back, {user?.name.split(' ')[0]} 👋</h1>
                                <p className="text-[#475569] dark:text-[#94A3B8] text-base max-w-xl font-medium">Track your research publications, submissions, reviews, and journal activities from one place.</p>
                            </div>
                            <Button onClick={() => router.push('/submit')} className="bg-[#0EA5A4] hover:bg-[#0d8c8b] text-white px-6 py-5 rounded-xl text-base font-bold shadow-sm shadow-[#0EA5A4]/20 hover:scale-105 transition-all">
                                <Send className="w-4 h-4 mr-2" /> Submit New Paper
                            </Button>
                        </div>
                    </div>

                    {/* Dynamic Tabs */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                        <div className="text-[#64748B] dark:text-[#94A3B8] text-xs font-semibold mb-1.5">{stat.label}</div>
                                        <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${stat.color}`}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Membership Details & Payments Columns */}
                            {(user?.hasMembership || user?.role === 'reader') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Column 1: Active Membership */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col">
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-[#0D7C66]" /> Membership Details
                                        </h3>
                                        <div className={`rounded-xl p-5 border flex-1 flex flex-col justify-center ${
                                            user?.hasMembership
                                                ? 'bg-gradient-to-br from-[#0D7C66]/10 to-[#0077b5]/10 border-[#0D7C66]/30'
                                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                        }`}>
                                            {user?.hasMembership ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide font-semibold mb-1">Current Plan</p>
                                                        <p className="text-lg font-bold text-[#0F172A] dark:text-white capitalize flex items-center gap-2">
                                                            {user.membershipPlan} Plan <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] uppercase font-bold">Active</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide font-semibold mb-1">Expiration Date</p>
                                                        {user.membershipExpiresAt ? (
                                                            <p className="text-sm font-medium text-[#0F172A] dark:text-white">
                                                                {new Date(user.membershipExpiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm font-medium text-[#0D7C66]">Lifetime access (Never expires)</p>
                                                        )}
                                                    </div>
                                                    <div className="pt-4 mt-2 border-t border-black/5 dark:border-white/5">
                                                        <Button onClick={() => router.push('/browse')} className="w-full bg-[#0D7C66] hover:bg-[#0a5c4d] text-white">
                                                            Browse Premium Papers
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-2">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Award className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-base font-bold text-[#0F172A] dark:text-white mb-2">No Active Membership</p>
                                                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">Upgrade your account to unlock premium papers and full PDF access.</p>
                                                    <Button onClick={() => router.push('/membership')} className="bg-[#0077b5] hover:bg-[#005e8e] text-white">
                                                        View Membership Plans
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 2: Payment Receipts */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col">
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#0077b5]" /> Latest Payment Receipt
                                        </h3>
                                        <div className="flex-1 flex flex-col justify-center">
                                            {paymentsLoading ? (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="w-6 h-6 border-2 border-[#0077b5] border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            ) : paymentsData?.data?.length ? (
                                                <div className="p-5 border border-[#0077b5]/20 dark:border-white/10 rounded-2xl bg-gradient-to-br from-white to-[#F8FAFC] dark:from-[#1E293B] dark:to-[#0F172A] shadow-sm relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#0077b5]/5 rounded-bl-full"></div>
                                                    
                                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-wider font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">Receipt For</p>
                                                            <p className="text-lg font-bold text-[#0F172A] dark:text-white capitalize">
                                                                {paymentsData.data[0].purpose === 'membership' ? `${paymentsData.data[0].planType} Membership` : 'Publication Fee'}
                                                            </p>
                                                        </div>
                                                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Paid
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="space-y-3 relative z-10">
                                                        <div className="flex justify-between items-center py-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Amount</span>
                                                            <span className="text-base font-bold text-[#0D7C66]">
                                                                {paymentsData.data[0].currency === 'INR' ? '₹' : '$'}{paymentsData.data[0].amount}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Date</span>
                                                            <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
                                                                {new Date(paymentsData.data[0].createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Transaction ID</span>
                                                            <span className="text-sm font-mono text-[#0F172A] dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                                {paymentsData.data[0].razorpayPaymentId?.slice(0, 14)}...
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center py-6 text-[#64748B] dark:text-[#94A3B8]">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                                        <FileText className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm font-semibold mb-1 text-[#0F172A] dark:text-white">No payment history</p>
                                                    <p className="text-xs">Your payment receipts will appear here.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Two Column Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Left Column: Recent Papers & Pipeline */}
                                <div className="xl:col-span-2 space-y-6">
                                    
                                    {/* Submission Pipeline */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 flex items-center gap-2">
                                            <Send className="w-4 h-4 text-[#0EA5A4]" /> Publication Pipeline
                                        </h3>
                                        <div className="flex items-center justify-between relative mt-2">
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-white/5 -z-10 rounded-full -translate-y-4 md:-translate-y-5"></div>
                                            <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#0EA5A4] to-[#22C55E] -z-10 rounded-full transition-all duration-1000 -translate-y-4 md:-translate-y-5" style={{ width: `${(currentStageIndex / 4) * 100}%` }}></div>
                                            
                                            {['Submitted', 'Review', 'Proofing', 'Payment', 'Published'].map((stage, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2 md:gap-3 bg-white dark:bg-[#1E293B] px-1 sm:px-2">
                                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-md transition-transform hover:scale-110 ${i <= currentStageIndex ? (i === 4 ? 'bg-[#22C55E] text-white' : 'bg-[#0EA5A4] text-white') : 'bg-gray-100 text-gray-400'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className={`text-[10px] md:text-xs font-semibold ${i <= currentStageIndex ? 'text-[#0F172A] dark:text-white' : 'text-[#64748B]'}`}>{stage}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Papers Table */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                                        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                                            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Recent Papers</h3>
                                            <button onClick={() => setActiveTab('papers')} className="text-xs text-[#0EA5A4] hover:underline font-semibold">View All</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-gray-50 dark:bg-white/5">
                                                    <tr>
                                                        <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase">Title</th>
                                                        <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase">Journal</th>
                                                        <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase">Status</th>
                                                        <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                                    {myPapersData?.data?.slice(0, 3).map((paper: Paper) => (
                                                        <tr key={paper._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setActiveTab('papers')}>
                                                            <td className="px-6 py-4 font-medium text-[#0F172A] dark:text-white truncate max-w-[200px]">{paper.title}</td>
                                                            <td className="px-6 py-4 text-sm text-[#64748B]">Journal</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                                    paper.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                                                    paper.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                                    paper.status === 'under_review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                                                                }`}>{paper.status.replace('_', ' ')}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-[#64748B]">{new Date(paper.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                    {(!myPapersData?.data || myPapersData.data.length === 0) && (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-8 text-center text-[#64748B] text-sm">No recent papers found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Profile & Timeline */}
                                <div className="space-y-6">
                                    {/* Profile Completion */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#0EA5A4]/20 to-transparent rounded-bl-full"></div>
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-4">Profile Completion</h3>
                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-3xl font-extrabold text-[#0EA5A4]">{profileCompletion}%</span>
                                            <span className="text-xs font-medium text-[#22C55E]">{profileCompletion >= 80 ? 'Great standing!' : 'Needs improvement'}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 mb-5 overflow-hidden">
                                            <div className="bg-gradient-to-r from-[#0EA5A4] to-[#22C55E] h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-[#0F172A] dark:text-white">Missing Information:</p>
                                            {missingFields.slice(0, 2).map((f) => (
                                                <div key={f.key as string} className="flex items-center gap-2 text-xs text-[#64748B]">
                                                    <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center"></div> {f.label}
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setActiveTab('profile')} className="mt-5 w-full py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">Complete Profile</button>
                                    </div>

                                    {/* Activity Timeline */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5">Activity Timeline</h3>
                                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#0EA5A4] before:to-transparent">
                                            {timeline.map((item, i) => (
                                                <div key={i} className="relative flex items-start gap-4">
                                                    <div className="absolute left-0 w-5 h-5 bg-white dark:bg-[#1E293B] border-4 border-[#0EA5A4] rounded-full mt-1 z-10 shadow-sm"></div>
                                                    <div className="pl-8 flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white break-words">{item.title}</h4>
                                                        <p className="text-xs text-[#64748B] mt-1 break-words">{item.desc}</p>
                                                        <time className="text-xs font-medium text-[#0EA5A4] mt-1 block">{item.date}</time>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Combined Papers, Submissions, Published Tab Content */}
                    {['papers', 'submissions', 'published'].includes(activeTab) && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in">
                            {showSuccess && activeTab === 'papers' && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-xl flex items-center shadow-sm">
                                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span><strong>Success!</strong> Your manuscript has been submitted successfully and is now publicly available.</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-bold text-2xl text-[#0F172A] dark:text-white">
                                    {activeTab === 'papers' ? 'My Papers' : activeTab === 'submissions' ? 'My Submissions' : 'Published Papers'}
                                </h2>
                                <Button onClick={() => router.push('/submit')} className="bg-[#0EA5A4] hover:bg-[#0d8c8b] text-white rounded-xl shadow-md hover:scale-105 transition-transform">
                                    <Send className="w-4 h-4 mr-2" /> Submit New
                                </Button>
                            </div>
                            
                            {(() => {
                                const papersToList = myPapersData?.data.filter((p: Paper) => {
                                    if (activeTab === 'submissions') return ['draft', 'submitted', 'under_review', 'rejected'].includes(p.status);
                                    if (activeTab === 'published') return p.status === 'published';
                                    return true; // for 'papers'
                                }) || [];



                                if (papersToList.length === 0) return (
                                    <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                        <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-4 opacity-50" />
                                        <p className="text-[#64748B] dark:text-[#94A3B8] font-medium text-lg">You haven't {activeTab === 'published' ? 'published' : 'submitted'} any papers yet.</p>
                                        <p className="text-[#94A3B8] text-sm mt-2 max-w-sm mx-auto">Click the button above to start your first manuscript submission.</p>
                                    </div>
                                );

                                return (
                                    <div className="space-y-6">
                                        {papersToList.map((paper: Paper) => (
                                        <div key={paper._id} className="border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#1E293B] hover:shadow-md transition-all rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start gap-6 shadow-sm">
                                            <div className="flex-1 min-w-0 overflow-hidden w-full">
                                                {paper.status === 'published' && paper.slug ? (
                                                    <a href={`/paper/${paper.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#0EA5A4] transition-colors cursor-pointer block group">
                                                        <h3 className="font-bold text-[#0F172A] group-hover:text-[#0EA5A4] dark:text-white text-base md:text-[17px] leading-snug break-all mb-2 transition-colors">{paper.title}</h3>
                                                    </a>
                                                ) : (
                                                    <h3 className="font-bold text-[#0F172A] dark:text-white text-base md:text-[17px] leading-snug break-all mb-2">{paper.title}</h3>
                                                )}
                                                
                                                {paper.authors && paper.authors.length > 0 && (
                                                    <div className="flex items-center gap-1.5 text-sm text-[#475569] dark:text-[#94A3B8] mb-3">
                                                        <UserIcon className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate flex-1 min-w-0">{paper.authors.map(a => a.split(' | ')[0].trim()).join(', ')}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                        paper.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                                        paper.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                        paper.status === 'under_review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                                                    }`}>{paper.status.replace('_', ' ')}</span>
                                                    <span className="text-sm font-medium text-[#64748B]">{new Date(paper.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                
                                                {paper.remarks && (
                                                    <div className="mt-2 text-sm bg-white dark:bg-[#0F172A] text-gray-800 dark:text-gray-300 p-4 rounded-xl border border-gray-200 dark:border-white/10 break-words shadow-sm">
                                                        <strong className="text-[#0EA5A4] flex items-center gap-2 mb-1"><MessageSquare className="w-4 h-4"/> Editorial Remark:</strong> {paper.remarks}
                                                    </div>
                                                )}
                                                
                                                {paper.correctionFiles && paper.correctionFiles.length > 0 && paper.status !== 'published' && (
                                                    <div className="mt-4 border border-indigo-200 dark:border-indigo-800/50 rounded-xl overflow-hidden shadow-sm">
                                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 border-b border-indigo-100 dark:border-indigo-800/50">
                                                            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                                                                📎 Correction files ({paper.correctionFiles.length})
                                                            </span>
                                                        </div>
                                                        <ul className="divide-y divide-indigo-50 dark:divide-indigo-900/20 bg-white dark:bg-[#0F172A]">
                                                            {paper.correctionFiles.map((cf, i) => (
                                                                <li key={i} className="flex items-center justify-between px-4 py-3">
                                                                    <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] truncate max-w-[200px]">{cf.name}</span>
                                                                    {cf.type === 'image' ? (
                                                                        <button onClick={() => setLightboxSrc(cf.data)} className="ml-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 transition-colors shrink-0">
                                                                            View
                                                                        </button>
                                                                    ) : (
                                                                        <a href={cf.data} download={cf.name} className="ml-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0">
                                                                            Download
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                                                {paper.pdfUrl && (
                                                    <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none justify-center inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors shadow-sm">
                                                        Download File
                                                    </a>
                                                )}
                                                {paper.status === 'submitted' && (
                                                    <>
                                                        <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-gray-200 dark:border-white/10 shadow-sm" onClick={() => router.push(`/submit?edit=${paper._id}`)}>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Button>
                                                        <Button variant="destructive" className="flex-1 md:flex-none rounded-xl shadow-sm" onClick={() => {
                                                            if (confirm('Withdraw this submission?')) deletePaperMutation.mutate(paper._id);
                                                        }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {paper.status === 'pre_proof' && (
                                                    <>
                                                        <Button className="flex-1 md:flex-none rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={() => {
                                                            if (confirm('Are you sure you want to approve this pre-proof? Once approved, the manuscript becomes immutable.')) {
                                                                approveProofMutation.mutate(paper._id);
                                                            }
                                                        }} disabled={approveProofMutation.isPending}>
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Approve Proof
                                                        </Button>
                                                        <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-500 shadow-sm" onClick={() => {
                                                            setCorrectionPaperId(paper._id);
                                                            setCorrectionNotes('');
                                                            setCorrectionFile(null);
                                                            setCorrectionModalOpen(true);
                                                        }} disabled={requestCorrectionMutation.isPending}>
                                                            <MessageSquare className="w-4 h-4 mr-2" /> Request Correction
                                                        </Button>
                                                    </>
                                                )}
                                                {paper.status === 'correction_requested' && (
                                                    <div className="flex flex-col gap-2 p-3 border border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 w-full">
                                                        <label className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Upload Corrected Manuscript</label>
                                                        <input 
                                                            type="file" 
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setSubmitCorrectionPaperId(paper._id);
                                                                    setSubmitCorrectionFile(file);
                                                                }
                                                            }}
                                                            className="text-xs w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 dark:file:bg-indigo-900/30 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800/40 cursor-pointer"
                                                        />
                                                        {(submitCorrectionFile && submitCorrectionPaperId === paper._id) && (
                                                            <Button 
                                                                onClick={handleSubmitCorrection} 
                                                                disabled={isSubmittingCorrection}
                                                                className="w-full text-xs py-1.5 h-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm mt-1"
                                                            >
                                                                {isSubmittingCorrection ? 'Uploading...' : 'Submit File'}
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                                {paper.status === 'payment_pending' && (
                                                    <Button className="flex-1 md:flex-none rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold" onClick={() => handlePayment(paper._id)}>
                                                        Pay Publication Fee
                                                    </Button>
                                                )}
                                                {(paper.status === 'published' || paper.status === 'payment_completed') && (paper as any).hasPayment && (
                                                    <a href={`/dashboard/receipt/${paper._id}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none justify-center inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                                                        <FileText className="w-3.5 h-3.5" /> Download Receipt
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Original Bookmarks Tab Content */}
                    {activeTab === 'bookmarks' && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in">
                            <h2 className="font-bold text-2xl text-[#0F172A] dark:text-white mb-8 flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-[#0EA5A4]" /> Saved Bookmarks
                            </h2>
                            {(!bookmarksData?.data || bookmarksData?.data.length === 0) ? (
                                <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                    <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-4 opacity-50" />
                                    <p className="text-[#64748B] dark:text-[#94A3B8] font-medium text-lg">You have no saved papers.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {bookmarksData?.data.filter((b) => b.paperId).map((b) => (
                                        <PaperCard key={b.paperId._id} paper={b.paperId} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Premium Profile Tab Content */}
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-2xl text-[#0F172A] dark:text-white flex items-center gap-3">
                                    <UserIcon className="w-6 h-6 text-[#0EA5A4]" /> Profile Settings
                                </h2>
                                <Button onClick={handleSubmit((d) => updateProfileMutation.mutate({ ...d, availableAsReviewer: preferences.reviewer, emailNotifications: preferences.email, newIssueAlerts: preferences.alerts } as any))} disabled={updateProfileMutation.isPending} className="bg-[#0EA5A4] hover:bg-[#0d8c8b] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-transform font-bold">
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save All Changes'}
                                </Button>
                            </div>

                            {updateProfileMutation.isSuccess && (
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-2 font-medium shadow-sm border border-green-200 dark:border-green-900/50">
                                    <CheckCircle className="w-5 h-5"/> Profile updated successfully.
                                </div>
                            )}

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Left Column: Form Cards */}
                                <div className="xl:col-span-2 space-y-6">
                                    <form id="profile-form" onSubmit={handleSubmit((d) => updateProfileMutation.mutate({ ...d, availableAsReviewer: preferences.reviewer, emailNotifications: preferences.email, newIssueAlerts: preferences.alerts } as any))} className="space-y-6">
                                        
                                        {/* Personal Information */}
                                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Personal Information</h3>
                                            
                                            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                                <div className="relative shrink-0 group">
                                                    <div
                                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                                        className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-[#0EA5A4]/50 cursor-pointer hover:border-[#0EA5A4] hover:opacity-90 transition-all relative"
                                                    >
                                                        {user?.avatarUrl ? (
                                                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0EA5A4] to-[#22C55E] flex items-center justify-center text-white text-3xl font-bold select-none">
                                                                {user?.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0EA5A4] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#0d8c8b] transition-colors"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </div>
                                                    <input
                                                        id="avatar-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            const formData = new FormData();
                                                            formData.append('avatar', file);
                                                            try {
                                                                await api.put('/api/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                                await fetchMe();
                                                            } catch {
                                                                alert('Failed to upload avatar. Please try again.');
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="name" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Full Name *</Label>
                                                        <Input id="name" {...register('name')} className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Email Address *</Label>
                                                        <Input disabled value={user?.email} className="border-gray-200 dark:border-white/10 rounded-xl h-11 bg-gray-100 dark:bg-white/5 text-gray-500 cursor-not-allowed" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Phone Number</Label>
                                                        <Input {...register('phone')} placeholder="+1 (555) 000-0000" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Gender</Label>
                                                            <select {...register('gender')} className="w-full border border-gray-200 dark:border-white/10 rounded-xl h-11 px-3 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-[#0EA5A4] dark:text-white">
                                                                <option value="">Select</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">DOB</Label>
                                                            <Input type="date" {...register('dob')} className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5 text-sm" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Information */}
                                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Academic Information</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="sm:col-span-2">
                                                    <Label htmlFor="institution" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Institution / University *</Label>
                                                    <Input id="institution" {...register('institution')} placeholder="E.g., Stanford University" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Department</Label>
                                                    <Input {...register('department')} placeholder="E.g., Computer Science" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Designation</Label>
                                                    <select {...register('designation')} className="w-full border border-gray-200 dark:border-white/10 rounded-xl h-11 px-3 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-[#0EA5A4] dark:text-white">
                                                        <option value="">Select Designation</option>
                                                        <option value="Student">Student</option>
                                                        <option value="Research Scholar">Research Scholar</option>
                                                        <option value="Professor">Professor</option>
                                                        <option value="Industry Professional">Industry Professional</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Field of Research</Label>
                                                    <Input {...register('fieldOfResearch')} placeholder="E.g., Artificial Intelligence" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Highest Qualification</Label>
                                                    <Input {...register('highestQualification')} placeholder="E.g., Ph.D." className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Research Interests</Label>
                                                <Input {...register('researchInterests')} placeholder="E.g., Machine Learning, NLP, Computer Vision (comma separated)" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                            </div>
                                        </div>

                                        {/* Professional Profiles */}
                                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Professional Profiles</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0 font-bold">iD</div>
                                                    <div className="flex-1">
                                                        <Input {...register('orcid')} placeholder="ORCID ID (e.g., 0000-0002-1825-0097)" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold">G</div>
                                                    <div className="flex-1">
                                                        <Input {...register('googleScholar')} placeholder="Google Scholar URL" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 flex items-center justify-center shrink-0 font-bold">in</div>
                                                    <div className="flex-1">
                                                        <Input {...register('linkedin')} placeholder="LinkedIn Profile URL" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Author Information */}
                                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Author Information</h3>
                                            <div className="mb-4">
                                                <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Short Biography</Label>
                                                <textarea {...register('bio')} rows={3} placeholder="Tell us a bit about your research background..." className="w-full border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5 text-sm outline-none dark:text-white resize-none"></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Country</Label>
                                                    <Input {...register('country')} placeholder="Country" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">State / Province</Label>
                                                    <Input {...register('state')} placeholder="State" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">City</Label>
                                                    <Input {...register('city')} placeholder="City" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                            </div>
                                        </div>


                                        {/* Security */}
                                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Security</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">New Password</Label>
                                                    <Input type="password" value={passwordData.new} onChange={e => setPasswordData(p => ({ ...p, new: e.target.value }))} placeholder="••••••••" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                                <div>
                                                    <Label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Confirm Password</Label>
                                                    <Input type="password" value={passwordData.confirm} onChange={e => setPasswordData(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="border-gray-200 dark:border-white/10 rounded-xl h-11 focus:ring-[#0EA5A4] bg-gray-50 dark:bg-white/5" />
                                                </div>
                                            </div>
                                            <Button type="button" onClick={async () => {
                                                if (!passwordData.new || !passwordData.confirm) {
                                                    alert('Please fill in all password fields');
                                                } else if (passwordData.new !== passwordData.confirm) {
                                                    alert('New passwords do not match');
                                                } else {
                                                    try {
                                                        await api.put('/api/auth/update-password', { newPassword: passwordData.new });
                                                        alert('Password updated successfully!');
                                                        setPasswordData({ new: '', confirm: '' });
                                                    } catch (err: any) {
                                                        alert(err.response?.data?.message || 'Failed to update password');
                                                    }
                                                }
                                            }} variant="outline" className="mt-4 rounded-xl text-sm font-semibold border-gray-300 dark:border-gray-600">
                                                Update Password
                                            </Button>
                                        </div>

                                    </form>
                                </div>

                                {/* Right Column: Widgets */}
                                <div className="space-y-6">
                                    {/* Profile Completion Widget */}
                                    <div className="bg-gradient-to-br from-[#0EA5A4] to-[#0d8c8b] rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
                                        <div className="absolute right-0 top-0 opacity-20 transform translate-x-4 -translate-y-4">
                                            <UserIcon className="w-32 h-32" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-base font-bold mb-4">Profile Strength</h3>
                                            <div className="flex items-end justify-between mb-2">
                                                <span className="text-3xl font-extrabold">{profileCompletion}%</span>
                                                <span className="text-xs text-white/70 mb-1">{profileCompletion >= 80 ? '🔥 Strong' : profileCompletion >= 50 ? '⚡ Good' : '📝 Incomplete'}</span>
                                            </div>
                                            <div className="w-full bg-black/20 rounded-full h-2.5 mb-4 overflow-hidden">
                                                <div className="bg-white h-2.5 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
                                            </div>
                                            {missingFields.length > 0 && (
                                                <div className="space-y-1.5 mt-3 bg-black/10 rounded-xl p-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/70">Still missing:</p>
                                                    {missingFields.slice(0, 4).map(f => (
                                                        <div key={f.key as string} className="flex items-center gap-2 text-xs font-medium text-white/80">
                                                            <div className="w-3.5 h-3.5 rounded border border-white/40 flex items-center justify-center shrink-0"></div>
                                                            {f.label}
                                                        </div>
                                                    ))}
                                                    {missingFields.length > 4 && <p className="text-[10px] text-white/50">+{missingFields.length - 4} more</p>}
                                                </div>
                                            )}
                                            {missingFields.length === 0 && (
                                                <div className="bg-black/10 rounded-xl p-3 text-center text-xs font-bold text-white">🎉 Profile Complete!</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Account Statistics */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Account Statistics</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#64748B]">Papers Submitted</span>
                                                <span className="text-sm font-bold text-[#0F172A] dark:text-white bg-gray-100 dark:bg-white/10 px-2.5 py-0.5 rounded-full">{myPapersData?.data?.length || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#64748B]">Papers Published</span>
                                                <span className="text-sm font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 rounded-full">{myPapersData?.data?.filter((p: Paper) => p.status === 'published').length || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#64748B]">Under Review</span>
                                                <span className="text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">{myPapersData?.data?.filter((p: Paper) => p.status === 'under_review').length || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#64748B]">Certificates Earned</span>
                                                <span className="text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 rounded-full">{user?.certificates?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification */}
                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-5 pb-3 border-b border-gray-100 dark:border-white/5">Account</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Email Verified</h4>
                                                    <p className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wider font-semibold">{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                                    <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Account Role</h4>
                                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-semibold">{user?.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Certificates Tab */}
                    {activeTab === 'certificates' && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5A4] to-[#0D7C66] flex items-center justify-center shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-2xl text-[#0F172A] dark:text-white">My Certificates</h2>
                                    <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">Certificates issued to you by Swapan Publication</p>
                                </div>
                            </div>

                            {user?.certificates && user.certificates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {user.certificates.map((cert, idx) => (
                                        <div key={idx} className="group relative bg-gradient-to-br from-[#F8FAFC] to-white dark:from-[#0F172A] dark:to-[#1E293B] border border-gray-100 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg hover:border-[#0EA5A4]/30 dark:hover:border-[#0EA5A4]/30 transition-all duration-300">
                                            {/* Decorative badge */}
                                            <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5A4]/20 to-[#0D7C66]/20 flex items-center justify-center">
                                                <Award className="w-5 h-5 text-[#0EA5A4]" />
                                            </div>

                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 shadow-sm">
                                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19.903 8.586a1 1 0 0 0-.217-.324l-5-5a1 1 0 0 0-.324-.217A1 1 0 0 0 14 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9a1 1 0 0 0-.097-.414zM17.586 9H15V6.414L17.586 9zM6 19a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h7v5a1 1 0 0 0 1 1h5v7a1 1 0 0 1-1 1H6z"/>
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0 pr-10">
                                                    <h3 className="font-bold text-[#0F172A] dark:text-white text-base leading-tight break-words">{cert.fileName}</h3>
                                                    <p className="text-[10px] text-[#94A3B8] mt-1 uppercase tracking-widest font-medium">PDF Certificate</p>
                                                </div>
                                            </div>

                                            {cert.note && (
                                                <div className="bg-[#0EA5A4]/5 dark:bg-[#0EA5A4]/10 border border-[#0EA5A4]/20 rounded-xl px-4 py-3 mb-4">
                                                    <p className="text-xs font-semibold text-[#0EA5A4] uppercase tracking-wider mb-1">Note from Admin</p>
                                                    <p className="text-sm text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed">{cert.note}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-[#94A3B8]">
                                                    Issued: {new Date(cert.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <a
                                                    href={cert.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0d8c8b] text-white text-xs font-bold rounded-lg transition-colors shadow-sm hover:shadow-md"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white dark:from-[#0F172A] dark:to-[#1E293B] rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#0EA5A4]/10 to-[#0D7C66]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <Award className="w-10 h-10 text-[#0EA5A4] opacity-50" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">No Certificates Yet</h3>
                                    <p className="text-[#64748B] dark:text-[#94A3B8] text-sm max-w-sm mx-auto">
                                        Certificates issued by Swapan Publication will appear here. Complete your submissions and reviews to earn recognition.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Placeholder for support tab */}
                    {activeTab === 'support' && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-16 text-center shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-10 h-10 text-[#0EA5A4] opacity-50" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3 capitalize">{activeTab}</h2>
                            <p className="text-[#64748B] text-lg max-w-md mx-auto">This premium feature is currently under development. Check back soon for updates!</p>
                        </div>
                    )}

                </main>
            </div>

            
            {/* Correction Request Modal */}
            {correctionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setCorrectionModalOpen(false)}>
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 w-full max-w-lg shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setCorrectionModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-500" /> Request Correction
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            You can submit correction notes and optionally upload a corrected manuscript or figure. <strong className="text-amber-600">Note: You can only request corrections ONCE per paper.</strong>
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="correctionNotes">Correction Notes <span className="text-red-500">*</span></Label>
                                <textarea 
                                    id="correctionNotes"
                                    value={correctionNotes}
                                    onChange={(e) => setCorrectionNotes(e.target.value)}
                                    className="w-full mt-1.5 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white min-h-[120px] resize-y focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Describe the corrections needed..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="correctionFile">Upload Corrected File (Optional)</Label>
                                <Input 
                                    id="correctionFile"
                                    type="file" 
                                    onChange={(e) => setCorrectionFile(e.target.files?.[0] || null)}
                                    className="mt-1.5 bg-gray-50 dark:bg-gray-800/50"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">Max size: 10MB. Accepted formats: Word, PDF, or Images.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setCorrectionModalOpen(false)}>Cancel</Button>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                                disabled={(!correctionNotes.trim() && !correctionFile) || requestCorrectionMutation.isPending || isUploadingCorrection}
                                onClick={async () => {
                                    try {
                                        setIsUploadingCorrection(true);
                                        let fileBase64;
                                        let fileName;
                                        
                                        if (correctionFile) {
                                            if (correctionFile.size > 10 * 1024 * 1024) {
                                                alert("File must be less than 10MB");
                                                return;
                                            }
                                            
                                            const reader = new FileReader();
                                            fileBase64 = await new Promise((resolve, reject) => {
                                                reader.onload = () => resolve(reader.result);
                                                reader.onerror = reject;
                                                reader.readAsDataURL(correctionFile);
                                            });
                                            fileName = correctionFile.name;
                                        }

                                        requestCorrectionMutation.mutate({ 
                                            id: correctionPaperId, 
                                            notes: correctionNotes,
                                            fileBase64: fileBase64 as string | undefined,
                                            fileName
                                        });
                                    } catch (e: any) {
                                        alert("Failed to process file: " + e.message);
                                    } finally {
                                        setIsUploadingCorrection(false);
                                    }
                                }}
                            >
                                {(requestCorrectionMutation.isPending || isUploadingCorrection) ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                ) : <Send className="w-4 h-4 mr-2" />}
                                Submit Correction
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox for correction images */}
            {lightboxSrc && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
                    onClick={() => setLightboxSrc(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setLightboxSrc(null)}
                            className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={lightboxSrc}
                            alt="Correction"
                            className="max-h-[75vh] max-w-full rounded-xl shadow-2xl object-contain border border-white/10"
                        />
                        <a
                            href={lightboxSrc}
                            download="correction-image"
                            className="mt-6 flex items-center gap-2 font-bold text-sm text-[#0F172A] bg-white hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Download Image
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
