import {
  ToastActionTrigger as ArkToastActionTrigger,
  ToastCloseTrigger as ArkToastCloseTrigger,
  ToastDescription as ArkToastDescription,
  ToastRoot as ArkToastRoot,
  ToastTitle as ArkToastTitle,
  type ToastActionTriggerProps,
  type ToastCloseTriggerProps,
  type ToastDescriptionProps,
  type ToastRootProps,
  type ToastTitleProps,
} from '@ark-ui/react/toast';
import { X } from 'lucide-react';
import { cn } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';
import { Button } from './button';

export type { CreateToasterReturn } from '@ark-ui/react/toast';
export { createToaster, Toaster } from '@ark-ui/react/toast';

const toastStyles = tv({
  slots: {
    root: 'relative flex items-start gap-3 rounded-l2 p-4 min-w-72 sm:max-w-sm [translate:var(--x)_var(--y)] scale-(--scale) z-(--z-index) h-(--height) opacity-(--opacity) will-change-transform transition-all duration-400 ease-[cubic-bezier(0.21,1.02,0.73,1)] data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:duration-200 data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)] data-[placement^=bottom]:[box-shadow:0_4px_12px_rgba(0,0,0,0.15),0_0_1px_rgba(0,0,0,0.2)] data-[placement^=top]:[box-shadow:0_-4px_12px_rgba(0,0,0,0.15),0_0_1px_rgba(0,0,0,0.2)] data-[type=success]:bg-success-default data-[type=success]:text-white data-[type=error]:bg-error-default data-[type=error]:text-white data-[type=warning]:bg-warning-default data-[type=warning]:text-white data-[type=info]:bg-info-default data-[type=info]:text-white',
    title: 'text-sm font-semibold',
    description: 'text-xs mt-0.5 opacity-90',
  },
});

export const ToastRoot = ({ className, ...props }: ToastRootProps) => {
  const { root } = toastStyles();
  return <ArkToastRoot className={root({ className })} {...props} />;
};

export const ToastTitle = ({ className, ...props }: ToastTitleProps) => {
  const { title } = toastStyles();
  return <ArkToastTitle className={title({ className })} {...props} />;
};

export const ToastDescription = ({ className, ...props }: ToastDescriptionProps) => {
  const { description } = toastStyles();
  return <ArkToastDescription className={description({ className })} {...props} />;
};

export const ToastCloseTrigger = ({ className, ...props }: ToastCloseTriggerProps) => {
  return (
    <ArkToastCloseTrigger className="absolute top-1 inset-e-1" {...props} asChild>
      <Button
        variant="ghost"
        size="xs"
        icon
        className={cn('text-current opacity-60 hover:opacity-100', className)}
      >
        <X size={14} />
      </Button>
    </ArkToastCloseTrigger>
  );
};

export const ToastActionTrigger = ({ className, ...props }: ToastActionTriggerProps) => {
  return <ArkToastActionTrigger className={className} {...props} />;
};
