'use client';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-lg text-[#4B5563] hover:text-[#1e3a8a] hover:bg-[#F1F5F9] dark:text-[#1e3a8a] dark:hover:text-[#152b66] dark:hover:bg-[#e8eef8] transition-colors"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
