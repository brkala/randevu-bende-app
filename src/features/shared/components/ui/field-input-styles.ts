import { tv } from '@/features/style/utils/tv';

export const fieldInputStyles = tv({
  base: 'w-full bg-bg-default text-fg-default placeholder:text-fg-subtle border border-border-default transition-colors duration-normal ease-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent disabled:pointer-events-none disabled:opacity-50 disabled:bg-bg-subtle disabled:text-fg-muted read-only:bg-bg-subtle read-only:text-fg-muted',
  variants: {
    size: {
      sm: 'h-8 px-2.5 text-xs rounded-l1',
      md: 'h-control-h px-3 text-control rounded-l2',
      lg: 'h-12 px-4 text-base rounded-l3',
    },
    state: {
      default: '',
      error: 'border-error-default focus-visible:ring-error-default',
      success: 'border-success-default focus-visible:ring-success-default',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});
