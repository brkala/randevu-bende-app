import { Checkbox as ArkCheckbox, type CheckboxRootProps } from '@ark-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const checkboxVariants = tv({
  slots: {
    root: 'flex items-center gap-2 cursor-pointer group',
    control:
      'flex items-center justify-center size-5 bg-bg-default border border-border-default rounded transition-colors duration-normal ease-enter data-[state=checked]:bg-accent-default data-[state=checked]:border-accent-default data-[state=unchecked]:hover:bg-bg-subtle disabled:opacity-50 disabled:pointer-events-none',
    indicator: 'text-accent-fg',
    label: 'text-sm text-fg-default select-none',
  },
  variants: {
    size: {
      sm: { control: 'size-4', label: 'text-xs' },
      md: { control: 'size-5', label: 'text-sm' },
      lg: { control: 'size-6', label: 'text-base' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type CheckboxVariants = VariantProps<typeof checkboxVariants>;

interface CheckboxProps extends Omit<CheckboxRootProps, 'size'>, Pick<CheckboxVariants, 'size'> {
  label?: string;
  indeterminate?: boolean;
}

const iconSizeMap: Record<string, number> = { sm: 14, md: 16, lg: 18 };

export const CheckboxField = ({ size, label, indeterminate, ...props }: CheckboxProps) => {
  const { root, control, indicator, label: labelClass } = checkboxVariants({ size });

  const iconSize = iconSizeMap[size ?? 'md'];

  return (
    <ArkCheckbox.Root className={root()} {...props}>
      <ArkCheckbox.Control className={control()}>
        <ArkCheckbox.Indicator className={indicator()}>
          {indeterminate ? <Minus size={iconSize} /> : <Check size={iconSize} />}
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      {label ? <ArkCheckbox.Label className={labelClass()}>{label}</ArkCheckbox.Label> : null}
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  );
};
