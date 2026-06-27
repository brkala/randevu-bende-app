import { Switch as ArkSwitch, type SwitchRootProps } from '@ark-ui/react/switch';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const switchVariants = tv({
  slots: {
    root: 'flex items-center gap-2 cursor-pointer',
    control:
      'relative inline-flex items-center rounded-full transition-colors duration-normal ease-enter bg-bg-subtle border border-border-default data-[state=checked]:bg-accent-default data-[state=checked]:border-accent-default data-disabled:opacity-50 data-disabled:pointer-events-none',
    thumb: 'block rounded-full bg-white shadow-sm transition-transform duration-normal ease-enter',
    label: 'text-sm text-fg-default select-none',
  },
  variants: {
    size: {
      sm: { control: 'w-8 h-4.5', thumb: 'w-3 h-3 data-[state=checked]:translate-x-3.5' },
      md: { control: 'w-10 h-5.5', thumb: 'w-4 h-4 data-[state=checked]:translate-x-4.5' },
      lg: { control: 'w-12 h-6.5', thumb: 'w-5 h-5 data-[state=checked]:translate-x-5.5' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type SwitchVariants = VariantProps<typeof switchVariants>;

interface SwitchProps extends Omit<SwitchRootProps, 'size'>, Pick<SwitchVariants, 'size'> {
  label?: string;
}

export const SwitchField = ({ size, label, ...props }: SwitchProps) => {
  const { root, control, thumb, label: labelClass } = switchVariants({ size });

  return (
    <ArkSwitch.Root className={root()} {...props}>
      <ArkSwitch.Control className={control()}>
        <ArkSwitch.Thumb className={thumb()} />
      </ArkSwitch.Control>
      {label ? <ArkSwitch.Label className={labelClass()}>{label}</ArkSwitch.Label> : null}
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  );
};
