'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Download, ZoomIn, ZoomOut, Maximize, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure the worker correctly for react-pdf v8 (uses .js instead of .mjs)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  title?: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1.2);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamically compute page width from container to prevent horizontal overflow
  const updatePageWidth = useCallback(() => {
    if (scrollRef.current) {
      const available = scrollRef.current.clientWidth - 32; // 32px for px-4 padding each side
      setPageWidth(Math.max(280, available));
    }
  }, []);

  useEffect(() => {
    updatePageWidth();
    const observer = new ResizeObserver(updatePageWidth);
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [updatePageWidth]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-[#F1F5F9] w-full h-full ${isFullscreen ? 'fixed top-0 left-0 z-50 w-screen h-screen' : ''}`}
    >
      {/* Sticky Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-1.5 bg-white border-b border-[#E2E8F0] z-10 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] p-0.5">
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium text-[#0F172A] min-w-[2.5rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={() => setScale(s => Math.min(2.0, s + 0.2))}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <span className="text-xs font-medium text-[#64748B] hidden sm:block">
            {numPages ? `${numPages} Pages` : 'Loading...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#E2E8F0] rounded-md transition-colors min-h-[32px]"
            aria-label="Download PDF"
          >
            <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span>
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#E2E8F0] rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
            title="Fullscreen"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDF Pages Container — no horizontal overflow on parent */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-8 px-2 sm:px-4 relative scroll-smooth custom-scrollbar">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-full text-[#64748B] py-20">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#0077b5]" />
              <p>Loading document securely...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full text-red-500 py-20 px-4 text-center">
              <FileText className="w-12 h-12 mb-4 opacity-50" />
              <p>Failed to load PDF. The file might be corrupted or inaccessible.</p>
              <a href={url} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-[#0077b5] text-white rounded hover:bg-[#005e8e] text-sm">
                Open Externally
              </a>
            </div>
          }
        >
          {Array.from(new Array(numPages || 0), (el, index) => (
            <div key={`page_${index + 1}`} className="mb-6 flex justify-center drop-shadow-md">
              <Page
                pageNumber={index + 1}
                width={Math.min(pageWidth, 800)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white max-w-full"
                loading={<div className="bg-[#E2E8F0] animate-pulse flex items-center justify-center text-[#64748B] text-sm" style={{ width: Math.min(pageWidth, 800), height: 400 }}>Loading page {index + 1}...</div>}
              />
            </div>
          ))}
        </Document>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
}
