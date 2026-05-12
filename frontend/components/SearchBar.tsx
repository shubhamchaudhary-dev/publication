'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  defaultValue?: string;
  large?: boolean;
}

export default function SearchBar({ defaultValue = '', large = false }: SearchBarProps) {
  const [q, setQ] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 w-full ${large ? 'max-w-2xl' : 'max-w-lg'}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8] w-4 h-4" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find articles with these terms..."
          className={`w-full pl-10 pr-4 bg-white dark:bg-[#1F2937] border border-gray-400 dark:border-[#374151] text-[#0F172A] dark:text-[#F1F5F9] placeholder-[#64748B] dark:placeholder-[#94A3B8] focus:outline-none focus:border-[#007398] transition-all rounded-sm ${large ? 'py-3.5 text-base' : 'py-2.5 text-sm'}`}
        />
      </div>
      <button
        type="submit"
        className={`bg-[#007398] hover:bg-[#005a78] text-white font-medium transition-colors whitespace-nowrap rounded-sm flex items-center gap-2 ${large ? 'px-8 py-3.5' : 'px-5 py-2.5 text-sm'}`}
      >
        <Search className="w-4 h-4" /> Search
      </button>
    </form>
  );
}
