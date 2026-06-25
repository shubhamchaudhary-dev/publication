'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function Footer() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="bg-white dark:bg-[#0A0F1C] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
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
      </footer>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
