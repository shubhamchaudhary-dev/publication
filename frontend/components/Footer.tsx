import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0A0F1C] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-[#333333] dark:text-[#F1F5F9] text-base font-medium mb-4">About SwarnPublication</h3>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#007398] font-medium">
              <Link href="/help" className="hover:underline flex items-center gap-1">Help ↗</Link>
              <Link href="/tutorials" className="hover:underline flex items-center gap-1">Online video tutorials ↗</Link>
              <Link href="/privacy-principles" className="hover:underline flex items-center gap-1">Privacy principles ↗</Link>
              <Link href="/accessibility" className="hover:underline flex items-center gap-1">Accessibility ↗</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#333333] dark:text-[#F1F5F9] text-base font-medium mb-4">Explore SwarnPublication</h3>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#007398] font-medium">
              <Link href="/browse" className="hover:underline flex items-center gap-1">Content syndication on SwarnPublication ↗</Link>
              <Link href="/alerts" className="hover:underline flex items-center gap-1">Create and manage alerts</Link>
              <Link href="/recommendations" className="hover:underline flex items-center gap-1">Receive personalized recommendations</Link>
              <Link href="/browse" className="hover:underline flex items-center gap-1">Browse by topic</Link>
            </div>
          </div>
          <div>
            <h3 className="text-[#333333] dark:text-[#F1F5F9] text-base font-medium mb-4">Explore Our Network</h3>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#007398] font-medium">
              <Link href="/" className="hover:underline flex items-center gap-1">Swarn Connect ↗</Link>
              <Link href="/submit" className="hover:underline flex items-center gap-1">Publish with Swarn ↗</Link>
              <Link href="/search" className="hover:underline flex items-center gap-1">Research Index ↗</Link>
              <Link href="/" className="hover:underline flex items-center gap-1">Analytics ↗</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E46B2C] pt-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <BookOpen className="w-12 h-12 text-[#64748B]" strokeWidth={1} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#E46B2C]">SWARN</span>
          </div>

          <div className="flex-1 mt-1">
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#333333] dark:text-[#F1F5F9] font-normal mb-3">
              <Link href="/about" className="hover:underline flex items-center gap-1">About SwarnPublication ↗</Link>
              <Link href="/remote" className="hover:underline flex items-center gap-1">Remote access</Link>
              <Link href="/contact" className="hover:underline flex items-center gap-1">Contact and support ↗</Link>
              <Link href="/terms" className="hover:underline flex items-center gap-1">Terms and conditions ↗</Link>
              <Link href="/privacy" className="hover:underline flex items-center gap-1">Privacy policy ↗</Link>
              <Link href="/cookies" className="hover:underline flex items-center gap-1">Cookie settings</Link>
            </div>
            <p className="text-[12px] text-[#4B5563] dark:text-[#94A3B8] leading-relaxed max-w-5xl">
              All content on this site: Copyright © {new Date().getFullYear()} Swarn B.V., its licensors, and contributors. All rights are reserved, including those for text and data mining, AI training, and similar technologies. For all open access content, the relevant licensing terms apply.
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 mt-4 md:mt-0">
            <div className="w-5 h-5 rounded-full border-2 border-[#E46B2C] flex items-center justify-center text-[#E46B2C] font-serif italic text-xs font-bold leading-none">S</div>
            <span className="text-[#333] dark:text-white font-medium text-lg tracking-wider">SWARN<sup className="text-[10px] ml-0.5">™</sup></span>
          </div>

          <div className="absolute right-0 -top-[70px] hidden lg:block">
            <button className="bg-[#007398] hover:bg-[#005a78] text-white px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 rounded-t-sm shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              FEEDBACK
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
