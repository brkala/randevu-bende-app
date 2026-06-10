import {
  PasswordInput as ArkPasswordInput,
  type PasswordInputControlProps,
  type PasswordInputIndicatorProps,
  type PasswordInputInputProps,
  type PasswordInputLabelProps,
  type PasswordInputRootProps,
  type PasswordInputVisibilityTriggerProps,
} from '@ark-ui/react/password-input';
import { Eye, EyeOff } from 'lucide-react';

import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const passwordStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    label: 'text-sm font-medium text-fg-default select-none',
    control: 'relative',
    trigger:
      'absolute inset-y-0 right-0 flex items-center justify-center px-3 text-fg-muted hover:text-fg-default transition-colors duration-normal ease-enter cursor-pointer disabled:pointer-events-none disabled:opacity-50',
    input:
      'w-full bg-bg-default text-fg-default placeholder:text-fg-subtle border border-border-default transition-colors duration-normal ease-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent disabled:pointer-events-none disabled:opacity-50 disabled:bg-bg-subtle disabled:text-fg-muted read-only:bg-bg-subtle read-only:text-fg-muted',
  },
  variants: {
    size: {
      sm: { input: 'h-8 px-2.5 text-xs rounded-l1' },
      md: { input: 'h-control-h px-3 text-control rounded-l2' },
      lg: { input: 'h-12 px-4 text-base rounded-l3' },
    },
    state: {
      default: {},
      error: {
        input: 'border-error-default focus-visible:ring-error-default',
      },
      success: {
        input: 'border-success-default focus-visible:ring-success-default',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

type PasswordVariants = VariantProps<typeof passwordStyles>;

// ─── Root ──────────────────────────────────────────────────

export const PasswordInputRoot = ({ className, ...props }: PasswordInputRootProps) => {
  const { root } = passwordStyles();
  return <ArkPasswordInput.Root className={root({ className })} {...props} />;
};

// ─── Label ─────────────────────────────────────────────────

export const PasswordInputLabel = ({ className, ...props }: PasswordInputLabelProps) => {
  const { label } = passwordStyles();
  return <ArkPasswordInput.Label className={label({ className })} {...props} />;
};

// ─── Control ───────────────────────────────────────────────

export const PasswordInputControl = ({ className, ...props }: PasswordInputControlProps) => {
  const { control } = passwordStyles();
  return <ArkPasswordInput.Control className={control({ className })} {...props} />;
};

// ─── Input ─────────────────────────────────────────────────

export interface PasswordInputInputProps_ extends Omit<PasswordInputInputProps, 'size'> {
  size?: PasswordVariants['size'];
  state?: PasswordVariants['state'];
}

export const PasswordInputInput = ({
  className,
  size,
  state,
  ...props
}: PasswordInputInputProps_) => {
  const { input } = passwordStyles({ size, state });
  return <ArkPasswordInput.Input className={input({ className })} {...props} />;
};

// ─── Visibility Trigger ────────────────────────────────────

export const PasswordInputVisibilityTrigger = ({
  className,
  ...props
}: PasswordInputVisibilityTriggerProps) => {
  const { trigger } = passwordStyles();
  return <ArkPasswordInput.VisibilityTrigger className={trigger({ className })} {...props} />;
};

// ─── Indicator ─────────────────────────────────────────────

export const PasswordInputIndicator = (props: PasswordInputIndicatorProps) => (
  <ArkPasswordInput.Indicator {...props} fallback={<Eye className="size-4" />}>
    <EyeOff className="size-4" />
  </ArkPasswordInput.Indicator>
);

// ─── Composed convenience ──────────────────────────────────

interface ComposedPasswordInputProps extends Omit<PasswordInputRootProps, 'invalid'> {
  label?: string;
  placeholder?: string;
  size?: PasswordVariants['size'];
  state?: PasswordVariants['state'];
  errorText?: string;
}

export const PasswordInput = ({
  label,
  placeholder,
  size,
  state,
  errorText,
  ...rootProps
}: ComposedPasswordInputProps) => (
  <PasswordInputRoot invalid={state === 'error'} {...rootProps}>
    {label ? <PasswordInputLabel>{label}</PasswordInputLabel> : null}
    <PasswordInputControl>
      <PasswordInputInput placeholder={placeholder} size={size} state={state} />
      <PasswordInputVisibilityTrigger>
        <PasswordInputIndicator />
      </PasswordInputVisibilityTrigger>
    </PasswordInputControl>
    {errorText ? <p className="text-xs text-error-default">{errorText}</p> : null}
  </PasswordInputRoot>
);
