import {
  Field as ArkField,
  type FieldErrorTextProps,
  type FieldHelperTextProps,
  type FieldLabelProps,
  type FieldRequiredIndicatorProps,
  type FieldRootProps,
} from '@ark-ui/react/field';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const fieldStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    label: 'text-sm font-medium text-fg-default select-none',
    requiredIndicator: 'text-error-default ml-0.5',
    helperText: 'text-xs text-fg-muted',
    errorText: 'text-xs text-error-default',
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
    required: {
      true: {
        label: "after:content-['*'] after:ml-0.5 after:text-error-default",
      },
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

type FieldVariants = VariantProps<typeof fieldStyles>;

// ─── Root ──────────────────────────────────────────────────

export const FieldRoot = ({ className, ...props }: FieldRootProps) => {
  const { root } = fieldStyles();
  return <ArkField.Root className={root({ className })} {...props} />;
};

// ─── Label ─────────────────────────────────────────────────

export const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
  const { label } = fieldStyles();
  return <ArkField.Label className={label({ className })} {...props} />;
};

// ─── Required Indicator ────────────────────────────────────

export const FieldRequiredIndicator = (props: FieldRequiredIndicatorProps) => {
  const { requiredIndicator } = fieldStyles();
  return <ArkField.RequiredIndicator className={requiredIndicator()} {...props} />;
};

// ─── Helper Text ───────────────────────────────────────────

export const FieldHelperText = ({ className, ...props }: FieldHelperTextProps) => {
  const { helperText } = fieldStyles();
  return <ArkField.HelperText className={helperText({ className })} {...props} />;
};

// ─── Error Text ────────────────────────────────────────────

export const FieldErrorText = ({ className, ...props }: FieldErrorTextProps) => {
  const { errorText } = fieldStyles();
  return <ArkField.ErrorText className={errorText({ className })} {...props} />;
};

// ─── Input ─────────────────────────────────────────────────

export interface FieldInputProps
  extends Omit<ArkField.InputProps, 'size' | 'state'>,
    Pick<FieldVariants, 'size' | 'state'> {}

export const FieldInput = ({ className, size, state, ...props }: FieldInputProps) => {
  const { input } = fieldStyles({ size, state });
  return <ArkField.Input className={input({ className })} {...props} />;
};
