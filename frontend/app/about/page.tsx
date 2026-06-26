'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Globe, Award, Sparkles, Target, Zap } from 'lucide-react';

const authors = [
  {
    id: 1,
    name: 'Dr. Sapna Nehra',
    role: 'Editor-in-Chief',
    institution: 'Nirwan University Jaipur',
    specialization: 'Academic Leadership & Research Publications',
    bio: 'Leading multidisciplinary academic publishing and research excellence initiatives.',
    quote: 'Research is formalized curiosity. It is poking and prying with a purpose.',
    image: '/images/authors/sapna.jpg',
  },
  {
    id: 2,
    name: 'Dr. Anuja Rohilla',
    role: 'Editorial Board Member',
    institution: 'Shri Guru Ram Rai University',
    location: 'Dehradun, Uttarakhand',
    bio: 'Researcher focused on music studies, interdisciplinary arts, and academic innovation.',
    quote: 'Interdisciplinary arts bridge the gap between tradition and modern innovation.',
    image: '/images/authors/anuja.jpg',
  },
  {
    id: 3,
    name: 'Dr. Sandeep Kishanrao Kakade',
    role: 'Editorial Board Member',
    institution: 'Vilasrao Deshmukh Foundation Group of Institutions',
    location: 'Latur, Maharashtra',
    bio: 'Research specialist in electronics, communication systems, and engineering innovation.',
    quote: 'Engineering innovation is the key to sustainable technological advancement.',
    image: '/images/authors/sandeep.png',
  },
  {
    id: 4,
    name: 'Dr. Reshu Gupta Singh',
    role: 'Editorial Board Member',
    institution: 'Central Institute of Petrochemicals Engineering & Technology',
    location: 'Jaipur, Rajasthan',
    bio: 'Expert in petrochemicals engineering, material sciences, and sustainable technologies.',
    quote: 'Material science shapes the future of sustainable engineering and environmental solutions.',
    image: '/images/authors/reshu.jpg',
  },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-[#0A0F1C] font-sans">
            <Navbar />
            
            <div className="flex-1 flex flex-col w-full">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#e0f2fe] via-[#f0f9ff] to-[#e0f2fe] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] relative overflow-hidden py-16 md:py-24">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#0D7C66] dark:text-[#2dd4bf] text-xs font-bold tracking-widest uppercase">ABOUT US</span>
                                <div className="h-[1px] w-8 bg-[#0D7C66] dark:bg-[#2dd4bf]"></div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-6 tracking-tight">
                                Swapan Publication
                            </h1>
                            <p className="text-base text-[#475569] dark:text-[#94a3b8] leading-relaxed max-w-md">
                                Dedicated to advancing global knowledge through rigorous peer-reviewed academic publishing across multiple disciplines.
                            </p>
                        </div>
                        <div className="hidden md:flex justify-end items-center relative">
                            {/* Abstract Illustration Using Lucide Icons */}
                            <div className="relative w-72 h-72 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#0055A4]/10 dark:bg-[#0055A4]/20 rounded-full blur-3xl"></div>
                                
                                {/* Main Book Element */}
                                <div className="relative z-10 w-32 h-32 bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg flex items-center justify-center border border-[#e2e8f0] dark:border-slate-700 rotate-6">
                                    <BookOpen className="w-16 h-16 text-[#0055A4] dark:text-[#60a5fa]" />
                                </div>

                                {/* Floating Globe */}
                                <div className="absolute -top-6 right-12 w-14 h-14 bg-[#f0fdf4] dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center animate-bounce border border-[#bbf7d0] dark:border-slate-600" style={{ animationDuration: '3.5s' }}>
                                    <Globe className="w-6 h-6 text-[#0D7C66]" />
                                </div>

                                {/* Floating Sparkles */}
                                <div className="absolute bottom-8 right-0 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center animate-bounce border border-[#e2e8f0] dark:border-slate-600" style={{ animationDuration: '4.5s' }}>
                                    <Sparkles className="w-5 h-5 text-[#ea580c]" />
                                </div>
                                
                                {/* Dots */}
                                <div className="absolute bottom-0 right-20 w-12 h-8 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center gap-1 border border-[#e2e8f0] dark:border-slate-700">
                                    <div className="w-1.5 h-1.5 bg-[#0055A4] rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-[#0D7C66] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-8 h-8 text-[#0055A4] dark:text-[#3b82f6]" />
                                <h2 className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] m-0">Our Mission</h2>
                            </div>
                            <div className="prose dark:prose-invert text-[#475569] dark:text-[#94A3B8] leading-loose text-justify">
                                <p className="mb-4 text-base">
                                    SwapanPublication publishes a growing collection of peer-reviewed academic journals spanning multiple disciplines including Social Sciences, Humanities, Engineering, and Applied Sciences. 
                                </p>
                                <p className="mb-4 text-base">
                                    Available in an open-access format, SwapanPublication's high-impact journals constitute a comprehensive archive of scholarly research, covering emerging and established fields for both practical and theoretical applications.
                                </p>
                                <p className="text-base">
                                    Our commitment to rigorous peer review ensures the highest standards in communicating significant research findings, innovative ideas, and scholarly discoveries to a global audience, bridging the gap between academia and real-world implementation.
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-md border border-[#E2E8F0] dark:border-[#1F2937] text-center hover:-translate-y-1 transition-transform group">
                                <div className="w-16 h-16 mx-auto bg-[#e0f2fe] dark:bg-[#1e3a8a] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Globe className="w-8 h-8 text-[#0055A4] dark:text-[#60a5fa]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">Open Access</h3>
                                <p className="text-sm font-medium text-[#64748B] dark:text-[#94a3b8]">Global reach and visibility for your research.</p>
                            </div>
                            <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-md border border-[#E2E8F0] dark:border-[#1F2937] text-center hover:-translate-y-1 transition-transform group">
                                <div className="w-16 h-16 mx-auto bg-[#f0fdf4] dark:bg-[#0D7C66]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Award className="w-8 h-8 text-[#0D7C66] dark:text-[#2dd4bf]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">Rigorous</h3>
                                <p className="text-sm font-medium text-[#64748B] dark:text-[#94a3b8]">High standards of peer review process.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editorial Board Section */}
                <div className="bg-white dark:bg-[#0A0F1C] py-16 md:py-24 border-t border-[#E2E8F0] dark:border-[#1F2937]">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e0f2fe] dark:bg-[#1e3a8a] rounded-full mb-6">
                                <Zap className="w-8 h-8 text-[#0055A4] dark:text-[#60a5fa]" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-4">Editorial Leadership</h2>
                            <p className="text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto text-lg">
                                Meet the distinguished academic minds driving research excellence and editorial standards at SwapanPublication.
                            </p>
                        </div>

                        <div className="flex flex-col divide-y divide-[#E2E8F0] dark:divide-[#1F2937] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden bg-white dark:bg-[#111827] shadow-sm">
                            {authors.map((author) => (
                                <div key={author.id} className="flex flex-col md:flex-row items-center gap-6 px-8 py-8 hover:bg-gray-50 dark:hover:bg-[#1e293b]/50 transition-colors group">
                                    {/* Circular Photo */}
                                    <div className="flex-shrink-0 w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-[#0F172A] shadow-lg relative">
                                        <img
                                            src={author.image}
                                            alt={author.name}
                                            className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                                                author.id === 3 ? 'object-contain bg-[#eef2f5]' : 'object-cover object-top'
                                            }`}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 text-center md:text-left">
                                        <div className="inline-block px-3 py-1 bg-[#f0fdf4] dark:bg-[#0D7C66]/20 text-[#0D7C66] dark:text-[#2dd4bf] text-xs font-bold rounded-full mb-3 uppercase tracking-widest">
                                            {author.role}
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">{author.name}</h3>
                                        <p className="text-sm font-semibold text-[#0055A4] dark:text-[#60a5fa] mb-3">{author.institution}</p>
                                        <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-xl">{author.bio}</p>
                                    </div>

                                    {/* Quote */}
                                    <div className="flex-shrink-0 w-full md:w-64 mt-4 md:mt-0 text-center md:text-right">
                                        <div className="relative inline-block text-left">
                                            <span className="absolute -top-4 -left-6 text-4xl text-[#CBD5E1] dark:text-[#334155] font-serif">"</span>
                                            <p className="text-sm italic text-[#64748B] dark:text-[#94A3B8] leading-relaxed relative z-10 font-medium">
                                                {author.quote}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
