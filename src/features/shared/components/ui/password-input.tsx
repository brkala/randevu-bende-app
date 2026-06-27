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
import { fieldInputStyles } from './field-input-styles';

const passwordStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    label: 'text-sm font-medium text-fg-default select-none',
    control: 'relative',
    trigger:
      'absolute inset-y-0 right-0 flex items-center justify-center px-3 text-fg-muted hover:text-fg-default transition-colors duration-normal ease-enter cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  },
});

type PasswordVariants = VariantProps<typeof fieldInputStyles>;

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
  return (
    <ArkPasswordInput.Input className={fieldInputStyles({ size, state, className })} {...props} />
  );
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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  'data-testid'?: string;
}

export const PasswordInput = ({
  label,
  placeholder,
  size,
  state,
  errorText,
  value,
  onChange,
  onBlur,
  ...rootProps
}: ComposedPasswordInputProps) => (
  <PasswordInputRoot invalid={state === 'error'} {...rootProps}>
    {label ? <PasswordInputLabel>{label}</PasswordInputLabel> : null}
    <PasswordInputControl>
      <PasswordInputInput
        placeholder={placeholder}
        size={size}
        state={state}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        data-testid={rootProps['data-testid']}
      />
      <PasswordInputVisibilityTrigger>
        <PasswordInputIndicator />
      </PasswordInputVisibilityTrigger>
    </PasswordInputControl>
    {errorText ? <p className="text-xs text-error-default">{errorText}</p> : null}
  </PasswordInputRoot>
);
