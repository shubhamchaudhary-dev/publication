'use client';
import { useState } from 'react';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title?: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-xl p-8 text-center">
        <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
        <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">Could not load PDF preview.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0D7C66] hover:bg-[#0a6655] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Open PDF
        </a>
      </div>
    );
  }

  return (
    <div className="border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl overflow-hidden">
      <iframe
        src={url}
        title={title || 'PDF Viewer'}
        className="w-full h-[600px]"
        onError={() => setError(true)}
      />
    </div>
  );
}
