'use client';
import Link from 'next/link';
import { Eye, Download, Bookmark } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';

export interface Paper {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  slug: string;
  pdfUrl: string;           // original user-submitted Word/PDF file
  publishedPdfUrl?: string; // admin-uploaded final formatted PDF
  views: number;
  downloads: number;
  status: string;
  remarks?: string;
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
  // Extract only the display name from "Name | email | contact | address | designation"
  const authorNames = paper.authors
    .map(a => a.split(' | ')[0].trim())
    .filter(Boolean)
    .join(', ');
  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl p-5 hover:border-[#0D7C66] dark:hover:border-[#0D7C66] hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Subject badge */}
      {paper.subject && (
        <span className="inline-block bg-[#E86C2C]/10 text-[#E86C2C] text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-3">
          {paper.subject.name}
        </span>
      )}

      {/* Title */}
      <Link href={`/paper/${paper.slug}`}>
        <h3 className="font-serif text-[#0F172A] dark:text-[#F1F5F9] font-semibold text-base leading-snug mb-2 line-clamp-2 hover:text-[#0D7C66] dark:hover:text-[#0D7C66] transition-colors cursor-pointer">
          {paper.title}
        </h3>
      </Link>

      {/* Authors */}
      <p className="text-[#64748B] dark:text-[#94A3B8] text-xs mb-2 line-clamp-1">
        {authorNames || 'Unknown Authors'}
      </p>

      {/* Abstract */}
      <p className="text-[#64748B] dark:text-[#94A3B8] text-sm line-clamp-2 flex-1 mb-4">
        {paper.abstract}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-[#1F2937]">
        <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8] text-xs">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(paper.views)}</span>
          <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatNumber(paper.downloads)}</span>
        </div>
        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={() => onBookmark(paper._id)}
              className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-[#0D7C66]' : 'text-[#94A3B8] hover:text-[#0D7C66]'}`}
              aria-label="Bookmark"
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
          <Link
            href={`/paper/${paper.slug}`}
            className="bg-[#0D7C66] hover:bg-[#0a6655] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
