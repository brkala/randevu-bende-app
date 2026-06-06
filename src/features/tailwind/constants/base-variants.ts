import { tv } from 'tailwind-variants';

export const baseVariants = tv({
  variants: {
    variant: {
      default: '',
      accent: '',
      success: '',
      error: '',
      warning: '',
      info: '',
      outline: '',
      ghost: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
});
