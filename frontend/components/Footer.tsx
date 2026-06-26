'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, User, FileText, Users, ChevronRight, Globe, Linkedin, Twitter, Mail, Sparkles } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function Footer() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="bg-white dark:bg-[#0A0F1C] mt-auto">
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-[#0A0F1C] dark:text-white text-base font-medium mb-2">About SwapanPublication</h3>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#007398] font-medium">
              <Link href="/about" className="hover:underline flex items-center gap-1">About Us</Link>
              <Link href="/contact" className="hover:underline flex items-center gap-1">Contact Us</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#0A0F1C] dark:text-white text-base font-medium mb-2">Explore SwapanPublication</h3>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#007398] font-medium">
              <Link href="/browse" className="hover:underline flex items-center gap-1">Browse Papers</Link>
              <Link href="/submit" className="hover:underline flex items-center gap-1">Submit Research</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#0A0F1C] dark:text-white text-base font-medium mb-2">Explore Our Network</h3>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#007398] font-medium">
              <Link href="/publish-guidelines" className="hover:underline flex items-center gap-1">Author Guidelines</Link>
              <Link href="/membership" className="hover:underline flex items-center gap-1">Membership</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E46B2C] pt-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 relative">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <BookOpen className="w-12 h-12 text-[#64748B]" strokeWidth={1} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#E46B2C]">SWAPAN</span>
          </div>

          <div className="flex-1 mt-1">

            <p className="text-[12px] text-[#4B5563] dark:text-[#94A3B8] leading-relaxed max-w-5xl">
              All content on this site: Copyright © {new Date().getFullYear()} Swapan B.V., its licensors, and contributors. All rights are reserved, including those for text and data mining, AI training, and similar technologies. For all open access content, the relevant licensing terms apply.
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 mt-4 md:mt-0">
            <div className="w-5 h-5 rounded-full border-2 border-[#E46B2C] flex items-center justify-center text-[#E46B2C] font-serif italic text-xs font-bold leading-none">S</div>
            <span className="text-[#333] dark:text-white font-medium text-lg tracking-wider">SWAPAN<sup className="text-[10px] ml-0.5">™</sup></span>
          </div>

          <div className="absolute right-0 -top-[70px] hidden lg:block">
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className="bg-[#007398] hover:bg-[#005a78] text-white px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 rounded-t-sm shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              FEEDBACK
            </button>
          </div>
        </div>
      </div>

      <div className="block md:hidden bg-[#FAFAFA] dark:bg-[#0F172A] pt-8 pb-12 px-5 font-sans">
        {/* About SwapanPublication */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100/60 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#0f172a] dark:text-white text-lg font-bold">About SwapanPublication</h3>
          </div>
          <div className="flex flex-col ml-[52px]">
            <Link href="/about" className="flex items-center justify-between py-3 border-b border-gray-200/60 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] font-medium text-[15px]">
              About Us
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </Link>
            <Link href="/contact" className="flex items-center justify-between py-3 border-b border-gray-200/60 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] font-medium text-[15px]">
              Contact Us
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </Link>
          </div>
        </div>

        {/* Explore SwapanPublication */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#0f172a] dark:text-white text-lg font-bold">Explore SwapanPublication</h3>
          </div>
          <div className="flex flex-col ml-[52px]">
            <Link href="/browse" className="flex items-center justify-between py-3 border-b border-gray-200/60 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] font-medium text-[15px]">
              Browse Papers
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </Link>
            <Link href="/submit" className="flex items-center justify-between py-3 border-b border-gray-200/60 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] font-medium text-[15px]">
              Submit Research
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </Link>
          </div>
        </div>

        {/* Explore Our Network */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100/60 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 dark:text-orange-400">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#0f172a] dark:text-white text-lg font-bold">Explore Our Network</h3>
          </div>
          <div className="flex flex-col ml-[52px]">
            <Link href="/publish-guidelines" className="flex items-center justify-between py-3 border-b border-gray-200/60 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] font-medium text-[15px]">
              Author Guidelines
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </Link>
            <Link href="/membership" className="flex items-center justify-between py-3 border-b border-gray-200/60 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] font-medium text-[15px]">
              Membership
              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </Link>
          </div>
        </div>

        {/* Tagline Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 mb-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] dark:shadow-none flex flex-col items-center text-center mx-1 border dark:border-white/5 border-transparent">
          <BookOpen className="w-12 h-12 text-[#1e293b] dark:text-[#F8FAFC] mb-1" strokeWidth={1.5} />
          <div className="w-6 h-[2px] bg-[#E46B2C] mb-2"></div>
          <span className="text-[14px] uppercase tracking-[0.25em] font-bold text-[#E46B2C] mb-3">SWAPAN</span>
          <p className="text-[#64748b] dark:text-[#94A3B8] text-[13px] max-w-[220px]">
            Advancing Knowledge. Inspiring Research.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] flex items-center justify-center text-[#1e293b] dark:text-[#F8FAFC]"><Globe size={18} /></div>
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] flex items-center justify-center text-[#1e293b] dark:text-[#F8FAFC]"><Linkedin size={18} /></div>
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] flex items-center justify-center text-[#1e293b] dark:text-[#F8FAFC]"><Twitter size={18} /></div>
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] flex items-center justify-center text-[#1e293b] dark:text-[#F8FAFC]"><Mail size={18} /></div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8 px-2">
          <div className="flex-1 h-[1px] bg-blue-100 dark:bg-white/10"></div>
          <Sparkles size={16} className="text-blue-300 fill-blue-300" />
          <div className="flex-1 h-[1px] bg-blue-100"></div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="text-center px-2 mb-10">
          <p className="text-[13px] text-[#475569] font-medium mb-4">
            © {new Date().getFullYear()} Swapan B.V., its licensors, and contributors.<br />All rights reserved.
          </p>
          <p className="text-[12px] text-[#64748b] leading-relaxed">
            All content on this site, including text and data mining, AI training, and similar technologies, is protected by copyright and other applicable laws. For all open access content, the relevant licensing terms apply.
          </p>
        </div>

        {/* Logo Bottom */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          <div className="w-7 h-7 rounded-full border-[1.5px] border-[#E46B2C] flex items-center justify-center text-[#E46B2C] font-serif italic text-sm font-bold leading-none">S</div>
          <span className="text-[#333] font-medium text-xl tracking-wide">SWAPAN<sup className="text-[11px] ml-0.5 font-bold">TM</sup></span>
        </div>
      </div>
      </footer>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
