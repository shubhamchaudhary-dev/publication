import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-[#E2E8F0] dark:border-[#374151] bg-white dark:bg-[#1F2937] px-3 py-2 text-[16px] text-[#0F172A] dark:text-[#F1F5F9] placeholder-[#64748B] dark:placeholder-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7C66] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
