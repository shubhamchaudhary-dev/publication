import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        submitted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        draft: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
        subject: 'bg-[#E86C2C]/10 text-[#E86C2C]',
        default: 'bg-[#F8FAFC] dark:bg-[#1F2937] text-[#0F172A] dark:text-[#F1F5F9]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, variant, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
