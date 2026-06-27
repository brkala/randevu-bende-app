import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const badgeVariants = tv({
  base: 'inline-flex items-center gap-1 font-medium whitespace-nowrap',
  variants: {
    variant: {
      default: 'bg-bg-subtle text-fg-default border border-border-default',
      accent: 'bg-accent-subtle text-accent-default',
      success: 'bg-success-subtle text-success-default',
      error: 'bg-error-subtle text-error-default',
      warning: 'bg-warning-subtle text-warning-default',
      info: 'bg-info-subtle text-info-default',
      outline: 'bg-transparent text-fg-default border border-border-default',
      ghost: 'bg-transparent text-fg-muted',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs rounded-l1',
      md: 'px-2.5 py-1 text-sm rounded-l2',
      lg: 'px-3 py-1.5 text-base rounded-l3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

export const Badge = ({ className, variant, size, children }: BadgeProps) => {
  return <span className={badgeVariants({ variant, size, className })}>{children}</span>;
};
