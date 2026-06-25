'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CMSFormData {
    heroHeadline: string;
    heroSubheadline: string;
    stats: {
        papers: number;
        authors: number;
        institutions: number;
    };
    requireMembershipForAllPapers: boolean;
    enablePublicationPayment: boolean;
    publicationFeeAmount: number;
    publicationFeeCurrency: string;
    razorpayKeyId: string;
    razorpaySecretKey: string;
    membershipFeeMonthly: number;
    membershipFeeYearly: number;
    membershipFeeLifetime: number;
}

export default function AdminCMSPage() {
    const queryClient = useQueryClient();
    const [featuredIds, setFeaturedIds] = useState<string[]>([]);
    const [featuredJournalIds, setFeaturedJournalIds] = useState<string[]>([]);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const { data: cmsData } = useQuery({
        queryKey: ['admin', 'cms'],
        queryFn: async () => (await api.get('/api/cms')).data.data,
    });

    const { data: papersData } = useQuery({
        queryKey: ['admin', 'papers'],
        queryFn: async () => (await api.get('/api/admin/papers?status=published&limit=100')).data.data,
    });

    const { data: journalsData } = useQuery({
        queryKey: ['admin', 'subjects'],
        queryFn: async () => (await api.get('/api/subjects')).data.data,
    });

    const { register, handleSubmit, reset } = useForm<CMSFormData>();

    useEffect(() => {
        if (cmsData?.value) {
            reset({
                heroHeadline: cmsData.value.heroHeadline || '',
                heroSubheadline: cmsData.value.heroSubheadline || '',
                stats: {
                    papers: cmsData.value.stats?.papers || 0,
                    authors: cmsData.value.stats?.authors || 0,
                    institutions: cmsData.value.stats?.institutions || 0,
                },
                requireMembershipForAllPapers: cmsData.value.requireMembershipForAllPapers || false,
                enablePublicationPayment: cmsData.value.enablePublicationPayment || false,
                publicationFeeAmount: cmsData.value.publicationFeeAmount || 0,
                publicationFeeCurrency: cmsData.value.publicationFeeCurrency || 'INR',
                razorpayKeyId: cmsData.value.razorpayKeyId || '',
                razorpaySecretKey: cmsData.value.razorpaySecretKey || '',
                membershipFeeMonthly: cmsData.value.membershipFeeMonthly || 199,
                membershipFeeYearly: cmsData.value.membershipFeeYearly || 1999,
                membershipFeeLifetime: cmsData.value.membershipFeeLifetime || 9999,
            });
            setFeaturedIds(cmsData.value.featuredPaperIds?.map((p: any) => typeof p === 'string' ? p : p._id) || []);
            setFeaturedJournalIds(cmsData.value.featuredJournalIds?.map((j: any) => typeof j === 'string' ? j : j._id) || []);
        }
    }, [cmsData, reset]);

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.put('/api/cms', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'cms'] });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    });

    const onSubmit = (data: CMSFormData) => {
        updateMutation.mutate({
            ...data,
            featuredPaperIds: featuredIds,
            featuredJournalIds: featuredJournalIds
        });
    };

    const toggleFeatured = (id: string) => {
        if (featuredIds.includes(id)) {
            setFeaturedIds(prev => prev.filter(x => x !== id));
        } else {
            if (featuredIds.length >= 6) {
                alert('Maximum 6 featured papers allowed');
                return;
            }
            setFeaturedIds(prev => [...prev, id]);
        }
    };

    const toggleFeaturedJournal = (id: string) => {
        if (featuredJournalIds.includes(id)) {
            setFeaturedJournalIds(prev => prev.filter(x => x !== id));
        } else {
            if (featuredJournalIds.length >= 10) {
                alert('Maximum 10 featured journals allowed');
                return;
            }
            setFeaturedJournalIds(prev => [...prev, id]);
        }
    };

    return (
        <div>
            <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-8">CMS Settings</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">Global Access Settings</h2>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="requireMembershipForAllPapers"
                            {...register('requireMembershipForAllPapers')}
                            className="w-5 h-5 text-[#0D7C66] rounded"
                        />
                        <Label htmlFor="requireMembershipForAllPapers" className="text-base cursor-pointer">
                            Require Membership to view PDFs for ALL papers
                        </Label>
                    </div>
                    <p className="text-xs text-[#64748B] mt-2 ml-8">If checked, no guests or non-member users will be able to read full PDFs across the entire platform.</p>
                </div>

                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="heroHeadline">Hero Headline</Label>
                            <Input id="heroHeadline" {...register('heroHeadline')} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="heroSubheadline">Hero Subheadline</Label>
                            <Input id="heroSubheadline" {...register('heroSubheadline')} className="mt-1" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">Static Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="statsPapers">Papers</Label>
                            <Input id="statsPapers" type="number" {...register('stats.papers', { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="statsAuthors">Authors</Label>
                            <Input id="statsAuthors" type="number" {...register('stats.authors', { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="statsInstitutions">Journals</Label>
                            <Input id="statsInstitutions" type="number" {...register('stats.institutions', { valueAsNumber: true })} className="mt-1" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">Publication Payment Settings</h2>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <input
                            type="checkbox"
                            id="enablePublicationPayment"
                            {...register('enablePublicationPayment')}
                            className="w-5 h-5 text-[#0D7C66] rounded"
                        />
                        <Label htmlFor="enablePublicationPayment" className="text-base cursor-pointer">
                            Enable Razorpay Publication Payments
                        </Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="publicationFeeAmount">Publication Fee Amount</Label>
                            <Input id="publicationFeeAmount" type="number" {...register('publicationFeeAmount', { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="publicationFeeCurrency">Currency</Label>
                            <Input id="publicationFeeCurrency" {...register('publicationFeeCurrency')} placeholder="INR" className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                            <Input id="razorpayKeyId" {...register('razorpayKeyId')} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="razorpaySecretKey">Razorpay Secret Key</Label>
                            <Input id="razorpaySecretKey" type="password" {...register('razorpaySecretKey')} className="mt-1" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-1 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">Membership Pricing</h2>
                    <p className="text-xs text-[#64748B] mb-5">Set the prices shown on the /membership page. These amounts are in INR (₹) by default.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="membershipFeeMonthly">Monthly Plan (₹)</Label>
                            <Input id="membershipFeeMonthly" type="number" {...register('membershipFeeMonthly', { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="membershipFeeYearly">Yearly Plan (₹)</Label>
                            <Input id="membershipFeeYearly" type="number" {...register('membershipFeeYearly', { valueAsNumber: true })} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="membershipFeeLifetime">Lifetime Plan (₹)</Label>
                            <Input id="membershipFeeLifetime" type="number" {...register('membershipFeeLifetime', { valueAsNumber: true })} className="mt-1" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">
                        Featured Papers (max 6)
                    </h2>
                    <div className="max-h-60 overflow-y-auto border border-[#E2E8F0] dark:border-[#374151] rounded-lg">
                        {papersData?.map((p: any) => (
                            <label key={p._id} className="flex items-center gap-3 p-3 hover:bg-[#F8FAFC] dark:hover:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#374151] cursor-pointer last:border-0">
                                <input
                                    type="checkbox"
                                    checked={featuredIds.includes(p._id)}
                                    onChange={() => toggleFeatured(p._id)}
                                    className="w-4 h-4 text-[#0D7C66] rounded"
                                />
                                <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">{p.title}</span>
                            </label>
                        ))}
                        {!papersData?.length && <div className="p-4 text-sm text-[#64748B]">No published papers available to feature.</div>}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] p-6">
                    <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] mb-4 border-b border-[#E2E8F0] dark:border-[#374151] pb-2">
                        Featured Journals (max 10)
                    </h2>
                    <div className="max-h-60 overflow-y-auto border border-[#E2E8F0] dark:border-[#374151] rounded-lg">
                        {journalsData?.map((j: any) => (
                            <label key={j._id} className="flex items-center gap-3 p-3 hover:bg-[#F8FAFC] dark:hover:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#374151] cursor-pointer last:border-0">
                                <input
                                    type="checkbox"
                                    checked={featuredJournalIds.includes(j._id)}
                                    onChange={() => toggleFeaturedJournal(j._id)}
                                    className="w-4 h-4 text-[#0D7C66] rounded"
                                />
                                <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">{j.name}</span>
                            </label>
                        ))}
                        {!journalsData?.length && <div className="p-4 text-sm text-[#64748B]">No journals available to feature.</div>}
                    </div>
                </div>

                <div className="flex items-center gap-4 border-t border-[#E2E8F0] dark:border-[#374151] pt-6">
                    <Button type="submit" disabled={updateMutation.isPending} className="bg-[#0D7C66] hover:bg-[#0a6655] text-white">
                        {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
                    </Button>
                    {saveSuccess && <span className="text-green-600 font-medium text-sm">Successfully saved!</span>}
                </div>
            </form>
        </div>
    );
}
