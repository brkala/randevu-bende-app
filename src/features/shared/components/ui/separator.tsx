import { tv } from '@/features/style/utils/tv';

const separatorStyles = tv({
  base: 'bg-border-default border-none',
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator = ({ orientation, className }: SeparatorProps) => (
  <hr className={separatorStyles({ orientation, className })} />
);
