'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Shield, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CMSConfig {
    membershipFeeMonthly: number;
    membershipFeeYearly: number;
    membershipFeeLifetime: number;
    publicationFeeCurrency: string;
    razorpayKeyId?: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function MembershipPage() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [config, setConfig] = useState<CMSConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);
    const [paymentConfigured, setPaymentConfigured] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/api/cms');
                if (res.data?.success) {
                    const val = res.data.data.value;
                    setConfig(val);
                    setPaymentConfigured(!!(val?.razorpayKeyId?.trim()));
                }
            } catch (error) {
                console.error("Failed to load CMS config", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSubscribe = async (planType: 'monthly' | 'yearly' | 'lifetime') => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/membership');
            return;
        }

        try {
            setProcessingPlan(planType);
            const orderRes = await api.post('/api/payments/create-membership-order', { planType });
            const { orderId, amount, currency, keyId } = orderRes.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: 'Swapan Publication',
                description: `Membership - ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        await api.post('/api/payments/verify-membership', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        await checkAuth(); // Refresh user state
                        alert('Membership activated successfully!');
                        router.push('/dashboard');
                    } catch (error) {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: '#0077b5',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function () {
                alert('Payment failed. Please try again.');
            });
            rzp.open();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to initiate payment.');
        } finally {
            setProcessingPlan(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A]">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-[#0077b5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const hasActiveMembership = user?.hasMembership;
    const currency = config?.publicationFeeCurrency || 'INR';
    const currencySymbol = currency === 'INR' ? '₹' : '$';

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] font-sans">
            <Navbar />
            
            <div className="flex-1 flex flex-col w-full">
                <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white mb-3 font-serif">
                        Become a Swapan Publication Member
                    </h1>
                    <p className="text-sm md:text-base text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto">
                        Enhance your research and publishing experience with exclusive member benefits designed for students, researchers, faculty members, and academicians.
                    </p>
                    <p className="text-sm md:text-base font-semibold text-[#0F172A] dark:text-[#E2E8F0] mt-2">
                        Join a growing academic community and access valuable resources throughout your research journey.
                    </p>
                </div>

                {hasActiveMembership ? (
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl p-8 text-center max-w-xl mx-auto border border-[#E2E8F0] dark:border-[#334155]">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3">You have an active membership!</h2>
                        <p className="text-[#64748B] dark:text-[#94A3B8] mb-6 text-base">
                            Your <strong className="text-[#0077b5] dark:text-[#42a5f5] capitalize">{user.membershipPlan}</strong> plan is currently active. You have full access to all premium content.
                        </p>
                        {user.membershipExpiresAt && (
                            <p className="text-xs md:text-sm font-medium text-[#475569] dark:text-[#CBD5E1] bg-[#F1F5F9] dark:bg-[#0F172A] py-2 px-4 rounded-lg inline-block">
                                Expires on: {new Date(user.membershipExpiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        )}
                        <div className="mt-10">
                            <Button onClick={() => router.push('/browse')} className="bg-[#0077b5] hover:bg-[#005e8e] text-white px-8 py-3 rounded-lg text-lg">
                                Explore Premium Papers
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                    <div className="max-w-5xl mx-auto">
                        {/* Payment not configured notice */}
                        {!paymentConfigured && (
                            <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-5 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-amber-600 dark:text-amber-300 font-bold text-sm">!</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Payment Gateway Not Configured</p>
                                    <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                                        Razorpay integration is not yet set up. Please ask the administrator to add the Razorpay API keys in
                                        {user?.role === 'admin' ? <a href="/admin/cms" className="underline font-bold ml-1">Admin → CMS Settings</a> : ' Admin → CMS Settings'}.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="grid md:grid-cols-3 gap-8">
                        {/* Monthly Plan */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#334155] hover:border-[#0077b5] transition-colors flex flex-col shadow-sm hover:shadow-md">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-1">Monthly Researcher</h3>
                                <p className="text-[#64748B] dark:text-[#94A3B8] text-xs">Perfect for students and occasional researchers.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-[#0F172A] dark:text-white">{currencySymbol}{config?.membershipFeeMonthly || 199}</span>
                                <span className="text-[#64748B] dark:text-[#94A3B8] text-sm">/month</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Member dashboard access</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Track manuscript submissions</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Download certificates & invoices</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Access research resources and guides</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Member-only announcements</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#0D7C66] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Priority customer support</span></li>
                            </ul>
                            <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Best For</span>
                                <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-0.5">Students & Early-career</p>
                            </div>
                            <Button 
                                onClick={() => handleSubscribe('monthly')} 
                                disabled={processingPlan !== null || !paymentConfigured}
                                className="w-full bg-[#F1F5F9] dark:bg-[#334155] hover:bg-[#E2E8F0] dark:hover:bg-[#475569] text-[#0F172A] dark:text-white font-semibold py-5 text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingPlan === 'monthly' ? 'Processing...' : 'Get Monthly Plan'}
                            </Button>
                        </div>

                        {/* Yearly Plan */}
                        <div className="bg-[#0077b5] rounded-2xl p-6 border-2 border-[#0077b5] transform md:-translate-y-2 shadow-xl flex flex-col relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-[#0F172A] text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-md">
                                <Star className="w-3 h-3" /> Most Popular
                            </div>
                            <div className="mb-4 mt-2">
                                <h3 className="text-lg font-bold text-white mb-1">Yearly Scholar</h3>
                                <p className="text-blue-100 text-xs">Designed for active researchers and academicians.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-white">{currencySymbol}{config?.membershipFeeYearly || 1999}</span>
                                <span className="text-blue-200 text-sm">/year</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" /><span className="text-xs text-white">Everything in Monthly</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" /><span className="text-xs text-white">Reduced publication processing charges</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" /><span className="text-xs text-white">Priority support assistance</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" /><span className="text-xs text-white">Access to exclusive webinars & workshops</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" /><span className="text-xs text-white">Annual digital membership certificate</span></li>
                            </ul>
                            <div className="mb-4 p-2 bg-white/10 rounded-lg text-center">
                                <span className="text-xs font-semibold text-[#FFD700]">Save over 15% annually</span>
                            </div>
                            <Button 
                                onClick={() => handleSubscribe('yearly')} 
                                disabled={processingPlan !== null || !paymentConfigured}
                                className="w-full bg-white hover:bg-gray-100 text-[#0077b5] font-bold py-5 text-sm rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingPlan === 'yearly' ? 'Processing...' : 'Subscribe Annually'}
                            </Button>
                        </div>

                        {/* Lifetime Plan */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#334155] hover:border-[#8B5CF6] transition-colors flex flex-col shadow-sm hover:shadow-md">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-1">Lifetime Academic Member</h3>
                                <p className="text-[#64748B] dark:text-[#94A3B8] text-xs">Long-term benefits for dedicated educators.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-[#0F172A] dark:text-white">{currencySymbol}{config?.membershipFeeLifetime || 9999}</span>
                                <span className="text-[#64748B] dark:text-[#94A3B8] text-sm">/once</span>
                            </div>
                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Everything in Yearly</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Maximum available member discounts</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Dedicated support assistance</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Access to exclusive member events</span></li>
                                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" /><span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Academic networking opportunities</span></li>
                                <li className="flex items-start gap-2"><Shield className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" /><span className="text-xs font-semibold text-[#8B5CF6]">Lifetime digital certificate</span></li>
                            </ul>
                            <div className="mb-4 p-2 bg-[#8B5CF6]/10 rounded-lg text-center opacity-0">
                                {/* Invisible spacer to align buttons with Yearly plan */}
                                <span className="text-xs font-semibold text-[#8B5CF6]">Spacer</span>
                            </div>
                            <Button 
                                onClick={() => handleSubscribe('lifetime')} 
                                disabled={processingPlan !== null || !paymentConfigured}
                                className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-[#8B5CF6] hover:text-white border border-[#E2E8F0] dark:border-[#334155] hover:border-[#8B5CF6] text-[#0F172A] dark:text-white font-semibold py-5 text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingPlan === 'lifetime' ? 'Processing...' : 'Get Lifetime Access'}
                            </Button>
                        </div>
                    </div>
                    </div>

                    {/* Additional Content Below Pricing Grid */}
                    <div className="max-w-4xl mx-auto mt-20 space-y-16">
                        
                        {/* Why Become a Member */}
                        <section>
                            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-8 text-center font-serif">Why Become a Member?</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#0D7C66]"></div> Research Support</h3>
                                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Access helpful resources, guides, and updates relevant to academic publishing.</p>
                                </div>
                                <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#0077b5]"></div> Exclusive Discounts</h3>
                                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Enjoy reduced fees on eligible publication and publication-related services.</p>
                                </div>
                                <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Priority Assistance</h3>
                                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Receive faster responses to membership and publication-related queries.</p>
                                </div>
                                <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div> Academic Community</h3>
                                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Stay connected with researchers, authors, and educators through member activities and events.</p>
                                </div>
                            </div>
                        </section>

                        {/* Important Note */}
                        <section className="bg-[#F1F5F9] dark:bg-[#111827] rounded-xl p-6 border-l-4 border-[#0F172A] dark:border-[#475569]">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Important Note
                            </h3>
                            <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed text-justify">
                                Membership provides access to exclusive benefits and services. Membership does <strong>not</strong> guarantee manuscript acceptance, publication, indexing, or inclusion in any external database. All submissions are subject to the standard editorial and review process.
                            </p>
                        </section>
                        
                    </div>
                    </>
                )}
                </main>
                <Footer />
            </div>
        </div>
    );
}
