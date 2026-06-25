'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, AlertTriangle, FileText, Users, Shield, BookOpen, Mail, ArrowLeft } from 'lucide-react';

export default function DeclarationPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] font-sans">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">

                {/* Back Button */}
                <Link
                    href="/submit"
                    className="inline-flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#0077b5] dark:hover:text-[#38bdf8] mb-8 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Submission Form
                </Link>

                {/* Header */}
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-white/5 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#0F172A] dark:to-[#1E293B] px-8 py-10 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-200/50 dark:bg-[#0077b5]/20 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-white dark:bg-[#1E293B] rounded-xl flex items-center justify-center shadow-sm">
                                    <FileText className="w-6 h-6 text-[#0077b5] dark:text-white" />
                                </div>
                                <div>
                                    <p className="text-[#0077b5] dark:text-[#38bdf8] text-sm font-semibold uppercase tracking-wider">Swapan Publication</p>
                                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#0F172A] dark:text-white">Submission Declaration</h1>
                                </div>
                            </div>
                            <p className="text-[#475569] dark:text-[#94A3B8] text-sm max-w-2xl leading-relaxed">
                                Please read this declaration carefully before submitting your manuscript. By checking the declaration box on the submission form, you confirm that all authors agree to and comply with the following terms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Declaration Sections */}
                <div className="space-y-4">

                    {/* 1. Originality */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">1. Originality of Work</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    The authors declare that the manuscript submitted is their original work, has not been previously published, and is not currently under consideration for publication in any other journal or conference. Any prior publication of a part of the work (e.g., conference proceedings) must be clearly stated.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. No Plagiarism */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">2. No Plagiarism</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    The submitted work is free from plagiarism. All sources, data, figures, tables, and ideas taken from other works have been properly cited and credited. The authors acknowledge that plagiarism in any form is unethical and constitutes grounds for immediate rejection or retraction.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Authorship */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">3. Authorship & Consent</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    All listed authors have made substantial contributions to the research and have read and approved the final version of the manuscript. All authors consent to the submission and agree to be accountable for the accuracy and integrity of the work. Guest or honorary authorship is not acceptable.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Peer Review */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">4. Peer Review & Editorial Process</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    The authors understand and agree that the submitted manuscript will undergo a peer review process. The editorial decision is final and at the sole discretion of the editor and reviewers. Submission does not guarantee acceptance or publication. Authors agree to cooperate with the editorial team and respond to reviewer comments within the stipulated time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5. Conflict of Interest */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">5. Conflict of Interest</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    All authors declare that there are no conflicts of interest (financial, personal, or professional) that could inappropriately influence or bias the research or its conclusions. Any funding sources, grants, or institutional affiliations that may be perceived as a conflict of interest must be disclosed in the manuscript.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 6. Ethical Compliance */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">6. Ethical Compliance</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    The research was conducted in accordance with all applicable ethical standards and institutional guidelines. Where required, ethical approval (e.g., from an Institutional Review Board) has been obtained, and appropriate consent has been taken from all participants. Research involving human subjects or animals must adhere to the relevant international ethical guidelines.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 7. Copyright */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">7. Copyright Transfer</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    Upon acceptance of the manuscript, the authors agree to transfer copyright to Swapan Publication. Authors retain the right to use their own work for personal, educational, or non-commercial research purposes. Any reproduction of the published work in other media requires written permission from Swapan Publication.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 8. Data Accuracy */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">8. Accuracy of Data & Results</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    The authors certify that all data, results, figures, and conclusions presented in the manuscript are accurate, genuine, and have not been fabricated, falsified, or manipulated. Any errors discovered post-submission must be immediately reported to the editorial team, and a correction or retraction may be requested.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 9. Contact */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-[#E2E8F0] dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">9. Corresponding Author Responsibility</h2>
                                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                                    The corresponding author is responsible for ensuring that all co-authors have read and agreed to the terms of this declaration. The corresponding author will act as the primary point of contact with the editorial office throughout the review, revision, and publication process, and will communicate all editorial decisions to co-authors promptly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Important Notice</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                                    Submission of a manuscript implies that all authors have read and agreed to all terms of this declaration. Violations — including plagiarism, data fabrication, duplicate submission, or undisclosed conflicts of interest — may result in immediate rejection, retraction of the published article, or notification of the authors' institutions.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer CTA */}
                <div className="mt-8 text-center">
                    <Link
                        href="/submit"
                        className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[#0077b5] dark:hover:bg-[#005e8e] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                    >
                        <CheckCircle className="w-4 h-4" />
                        I Have Read — Return to Submission
                    </Link>
                    <p className="text-xs text-[#94A3B8] mt-3">Check the declaration checkbox on the submission form to confirm your agreement.</p>
                </div>

            </main>

            <Footer />
        </div>
    );
}
