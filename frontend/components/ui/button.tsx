import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#0D7C66] text-white hover:bg-[#0a6655]',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-[#E2E8F0] dark:border-[#374151] bg-transparent hover:bg-[#F8FAFC] dark:hover:bg-[#1F2937] text-[#0F172A] dark:text-[#F1F5F9]',
        secondary: 'bg-[#F8FAFC] dark:bg-[#1F2937] text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#E2E8F0] dark:hover:bg-[#374151]',
        ghost: 'hover:bg-[#F8FAFC] dark:hover:bg-[#1F2937] text-[#0F172A] dark:text-[#F1F5F9]',
        link: 'text-[#0D7C66] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
