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
import { fieldInputStyles } from './field-input-styles';

const fieldStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5 w-full',
    label: 'text-sm font-medium text-fg-default select-none',
    requiredIndicator: 'text-error-default ml-0.5',
    helperText: 'text-xs text-fg-muted',
    errorText: 'text-xs text-error-default',
  },
  variants: {
    required: {
      true: {
        label: "after:content-['*'] after:ml-0.5 after:text-error-default",
      },
    },
  },
});

type FieldVariants = VariantProps<typeof fieldInputStyles>;

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
  return <ArkField.Input className={fieldInputStyles({ size, state, className })} {...props} />;
};
