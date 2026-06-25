'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Send, User, Building, MessageSquare, ShieldCheck, ChevronDown } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        affiliation: '',
        inquiryType: 'general',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit inquiry');
            }

            setSuccessMessage('Thank you for reaching out to Swapan Publication. We will get back to you shortly.');
            setFormData({
                name: '',
                email: '',
                affiliation: '',
                inquiryType: 'general',
                message: ''
            });
        } catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-[#0A0F1C] font-sans">
            <Navbar />
            
            <div style={{ zoom: 0.90 }} className="flex-1 flex flex-col w-full">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#e0f2fe] via-[#f0f9ff] to-[#e0f2fe] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] relative overflow-hidden py-16 md:py-24">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[#0D7C66] dark:text-[#2dd4bf] text-xs font-bold tracking-widest uppercase">GET IN TOUCH</span>
                            <div className="h-[1px] w-8 bg-[#0D7C66] dark:bg-[#2dd4bf]"></div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-6 tracking-tight">
                            Contact Swapan Publication
                        </h1>
                        <p className="text-base text-[#475569] dark:text-[#94a3b8] leading-relaxed max-w-md">
                            We're here to help! Reach out to us for any queries related to submissions, memberships, partnerships, or general inquiries.
                        </p>
                    </div>
                    <div className="hidden md:flex justify-end items-center relative">
                        {/* Abstract Illustration Using Lucide Icons */}
                        <div className="relative w-72 h-72 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#2dd4bf]/20 dark:bg-[#0D7C66]/20 rounded-full blur-3xl"></div>
                            
                            {/* Main Envelope Element */}
                            <div className="relative z-10 w-40 h-32 bg-[#bbf7d0] dark:bg-[#1e293b] rounded-2xl shadow-lg flex items-center justify-center border-4 border-white dark:border-slate-700">
                                <span className="text-5xl font-bold text-[#0055A4]">@</span>
                            </div>

                            {/* Floating Paper Plane */}
                            <div className="absolute -top-8 right-12 w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                                <Send className="w-6 h-6 text-[#94a3b8]" />
                            </div>

                            {/* Floating Phone Icon */}
                            <div className="absolute top-16 right-0 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
                                <MessageSquare className="w-5 h-5 text-[#0055A4]" />
                            </div>
                            
                            {/* Dots */}
                            <div className="absolute bottom-4 right-16 w-12 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center gap-1">
                                <div className="w-1.5 h-1.5 bg-[#0D7C66] rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-[#0D7C66] rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-[#0D7C66] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 w-full flex-grow">
                <div className="grid md:grid-cols-5 gap-12 lg:gap-16">
                    
                    {/* Contact Information (Left Column) */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Contact Information</h2>
                            <div className="h-1 w-12 bg-[#0055A4] rounded-full mb-6"></div>
                            <p className="text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-8">
                                Whether you have a question about submitting a manuscript, joining our editorial board, or general publication queries, our team is ready to assist you.
                            </p>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-[#1F2937] flex items-center gap-5 group hover:shadow-md transition-shadow">
                            <div className="bg-[#f0fdf4] dark:bg-[#0D7C66]/20 p-4 rounded-full text-[#0D7C66] dark:text-[#2dd4bf] shrink-0 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Email Us</h3>
                                <p className="text-[#64748B] text-sm mb-1">Our friendly team is here to help.</p>
                                <a href="mailto:swapanpublication@gmail.com" className="text-[#0D7C66] dark:text-[#2dd4bf] font-bold text-sm hover:underline">
                                    swapanpublication@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-[#1F2937] flex items-start gap-5 group hover:shadow-md transition-shadow">
                            <div className="bg-[#f0fdf4] dark:bg-[#0D7C66]/20 p-4 rounded-full text-[#0D7C66] dark:text-[#2dd4bf] shrink-0 group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">Office Address</h3>
                                <p className="text-[#64748B] text-sm mb-2">Visit our headquarters.</p>
                                <p className="text-[#475569] dark:text-[#94A3B8] font-medium text-sm leading-relaxed mb-3">
                                    A-48, Ambedkar Nagar, Kherado<br />
                                    Alwar, Rajasthan 301001<br />
                                    India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form (Right Column) */}
                    <div className="md:col-span-3">
                        <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-[#E2E8F0] dark:border-[#1F2937]">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-[#e0f2fe] dark:bg-[#0055A4]/20 p-3 rounded-full text-[#0D7C66] dark:text-[#2dd4bf]">
                                    <Send className="w-6 h-6 -ml-1 mt-1 transform -rotate-12" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Send us a Message</h2>
                                    <div className="h-1 w-12 bg-[#0D7C66] rounded-full mt-2"></div>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-bold text-[#374151] dark:text-[#94A3B8] uppercase tracking-wide">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                name="name" 
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] focus:ring-2 focus:ring-[#0055A4] focus:border-[#0055A4] outline-none transition-all text-sm"
                                                placeholder="Dr. Jane Doe"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-[#374151] dark:text-[#94A3B8] uppercase tracking-wide">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] focus:ring-2 focus:ring-[#0055A4] focus:border-[#0055A4] outline-none transition-all text-sm"
                                                placeholder="jane.doe@university.edu"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Affiliation */}
                                    <div className="space-y-2">
                                        <label htmlFor="affiliation" className="text-xs font-bold text-[#374151] dark:text-[#94A3B8] uppercase tracking-wide">Academic Affiliation</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Building className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                id="affiliation" 
                                                name="affiliation" 
                                                value={formData.affiliation}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] focus:ring-2 focus:ring-[#0055A4] focus:border-[#0055A4] outline-none transition-all text-sm"
                                                placeholder="University / Institute"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Inquiry Type */}
                                    <div className="space-y-2">
                                        <label htmlFor="inquiryType" className="text-xs font-bold text-[#374151] dark:text-[#94A3B8] uppercase tracking-wide">Inquiry Type</label>
                                        <div className="relative">
                                            <select 
                                                id="inquiryType" 
                                                name="inquiryType" 
                                                value={formData.inquiryType}
                                                onChange={handleChange}
                                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] focus:ring-2 focus:ring-[#0055A4] focus:border-[#0055A4] outline-none transition-all appearance-none cursor-pointer text-sm font-medium"
                                            >
                                                <option value="general">General Inquiry</option>
                                                <option value="submission">Paper Submission Support</option>
                                                <option value="editorial">Editorial Board Application</option>
                                                <option value="partnership">Academic Partnership</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <ChevronDown className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold text-[#374151] dark:text-[#94A3B8] uppercase tracking-wide">Your Message</label>
                                    <div className="relative">
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="w-full p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] focus:ring-2 focus:ring-[#0055A4] focus:border-[#0055A4] outline-none transition-all resize-y text-sm"
                                            placeholder="How can we help you today?"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Status Messages */}
                                {successMessage && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-800 text-sm font-medium flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 shrink-0" />
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 text-sm font-medium">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-[#0055A4] hover:bg-[#004080] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#0055A4]/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Send Message
                                        </>
                                    )}
                                </button>
                                
                                {/* Privacy Notice */}
                                <div className="flex items-center justify-center gap-1.5 mt-4 text-[#94a3b8]">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <p className="text-xs font-medium">We respect your privacy. Your information will never be shared.</p>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
