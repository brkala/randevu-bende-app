import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { tv, type VariantProps } from 'tailwind-variants';
import { baseVariants } from '@/features/tailwind/constants/base-variants';

export const buttonVariants = tv({
  extend: baseVariants,
  base: 'inline-flex items-center justify-center gap-2 rounded-l2 leading-none font-control text-control h-control-h px-4 transition-colors duration-normal ease-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  variants: {
    variant: {
      accent: 'bg-accent-default text-accent-fg hover:bg-accent-600 active:bg-accent-700',
      default:
        'bg-bg-default text-fg-default hover:bg-bg-hover active:bg-bg-active border border-border-default',
      success: 'bg-success-default text-white hover:bg-success-700 active:bg-success-800',
      error: 'bg-error-default text-white hover:bg-error-700 active:bg-error-800',
      warning: 'bg-warning-default text-white hover:bg-warning-600 active:bg-warning-700',
      info: 'bg-info-default text-white hover:bg-info-700 active:bg-info-800',
      outline:
        'bg-transparent text-fg-default hover:bg-bg-hover active:bg-bg-active border border-border-default',
      ghost: 'bg-transparent text-fg-default hover:bg-bg-hover active:bg-bg-active',
    },
    size: {
      sm: 'h-8 px-3 text-xs rounded-l1',
      md: 'h-control-h px-4 text-base',
      lg: 'h-12 px-6 text-base rounded-l3',
    },
    fullWidth: {
      true: 'w-full',
    },
    icon: {
      true: '',
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      icon: true,
      class: 'w-8 px-0',
    },
    {
      size: 'md',
      icon: true,
      class: 'w-control-h px-0',
    },
    {
      size: 'lg',
      icon: true,
      class: 'w-12 px-0',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface ButtonProps extends HTMLArkProps<'button'>, VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, fullWidth, icon, ...props }: ButtonProps) => {
  return (
    <ark.button
      className={buttonVariants({ variant, size, fullWidth, icon, className })}
      {...props}
    />
  );
};
