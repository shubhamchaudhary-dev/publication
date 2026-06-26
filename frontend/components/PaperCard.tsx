'use client';
import Link from 'next/link';
import { Eye, Download, Bookmark } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface Paper {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  slug: string;
  pdfUrl: string;
  publishedPdfUrl?: string;
  correctionFiles?: Array<{ data: string; type: 'image' | 'document'; name: string }>;
  views: number;
  downloads: number;
  status: string;
  remarks?: string;
  coverImage?: string;
  keywords?: string[];
  highlights?: string;
  requiresMembership?: boolean;
  reviewers?: any[];
  subject?: { name: string; slug: string } | string;
  createdBy?: { _id?: string; name: string; institution?: string } | string;
  publishedAt?: string;
  createdAt: string;
}

interface PaperCardProps {
  paper: Paper;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export default function PaperCard({ paper, onBookmark, isBookmarked }: PaperCardProps) {
  const router = useRouter();

  // Extract only the display name from "Name | email | contact | address | designation"
  const authorNames = paper.authors
    .map(a => a.split(' | ')[0].trim())
    .filter(Boolean)
    .join(', ');

  const subjectName = typeof paper.subject === 'object' && paper.subject?.name ? paper.subject.name : 'Research';

  return (
    <div 
      onClick={() => router.push(`/paper/${paper.slug}`)}
      className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl md:rounded-md p-5 md:p-6 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col">
        {/* Badge */}
        <div className="flex gap-2 mb-2.5 flex-wrap items-center">
          <span className="bg-[#F3F4F6] dark:bg-[#374151] text-[#374151] dark:text-[#D1D5DB] text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md tracking-wider">
            {subjectName}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="font-sans text-[#111827] dark:text-[#F3F4F6] text-[18px] sm:text-[20px] font-bold leading-[1.3] break-words line-clamp-3 mb-2">
          {paper.title}
        </h3>
        
        {/* Authors */}
        <p className="text-[13px] font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-3">
          {authorNames || 'Unknown Authors'}
        </p>
        
        {/* Abstract */}
        <p className="text-[13.5px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed line-clamp-2 mb-5 break-words">
          {paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}
        </p>
        
        {/* Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); window.open(`/paper/${paper.slug}`, '_blank'); }}
          className="w-full bg-[#111827] dark:bg-white dark:text-[#111827] text-white text-[14px] font-medium py-3 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
        >
          <Eye className="w-4 h-4" /> Read Paper
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full flex-row gap-6 lg:gap-8">
        {/* Meta Sidebar (Left) */}
        <div className="flex-none w-36 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase text-[#0F172A] dark:text-[#F1F5F9] tracking-[0.05em]">
            {subjectName}
          </span>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            {paper.publishedAt ? formatDate(paper.publishedAt) : formatDate(paper.createdAt)}
          </span>
        </div>

        {/* Body (Right) */}
        <div className="flex-1 flex flex-col">
          <Link href={`/paper/${paper.slug}`} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-[#0077b5] dark:text-[#5ab4e5] text-xl leading-snug font-medium mb-2 group-hover:underline break-words line-clamp-2">
              {paper.title}
            </h3>
          </Link>
          
          <p className="text-[13px] text-[#94A3B8] dark:text-[#64748B] mb-3">
            {authorNames || 'Unknown Authors'}
          </p>
          
          <p className="text-[13.5px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed line-clamp-4 mb-4 break-words">
            {paper.abstract?.replace(/\[Corresponding Email:.*?\]\s*/gi, '').trim()}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-3 flex-wrap mt-auto text-[13px] text-[#0D7C66] font-semibold">
            <span className="flex items-center gap-1.5 shrink-0"><Eye className="w-4 h-4" /> {formatNumber(paper.views)} views</span>
            <span className="flex items-center gap-1.5 shrink-0"><Download className="w-4 h-4" /> {formatNumber(paper.downloads)} downloads</span>
            
            <div className="ml-auto flex items-center gap-3">
              {onBookmark && (
                <button
                  onClick={(e) => { e.stopPropagation(); onBookmark(paper._id); }}
                  className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-[#0D7C66] bg-[#0D7C66]/10' : 'text-[#94A3B8] hover:text-[#0D7C66] hover:bg-[#0D7C66]/10'}`}
                  aria-label="Bookmark"
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              )}
              <Link
                href={`/paper/${paper.slug}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-[#0077b5] hover:bg-[#005e8e] text-white text-[13px] font-medium px-4 py-1.5 rounded transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
