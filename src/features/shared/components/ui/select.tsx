import { type CollectionItem, createListCollection } from '@ark-ui/react/collection';
import {
  Select as ArkSelect,
  type SelectContentProps,
  type SelectItemProps,
  type SelectLabelProps,
  type SelectTriggerProps,
} from '@ark-ui/react/select';
import { ChevronDown } from 'lucide-react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const selectStyles = tv({
  slots: {
    trigger:
      'flex items-center justify-between gap-2 border border-border-default bg-bg-default transition-colors duration-normal ease-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    content:
      'bg-bg-default border border-border-default rounded-l2 shadow-lg py-1 min-w-[--reference-width] z-50 outline-none',
    item: 'bg-bg-default px-3 py-2 text-sm text-fg-default cursor-pointer transition-colors duration-normal ease-enter hover:bg-bg-hover data-highlighted:bg-bg-hover data-disabled:opacity-50 data-disabled:pointer-events-none',
    label: 'px-3 py-1.5 text-xs text-fg-muted font-medium',
    valueText: 'text-fg-default',
  },
  variants: {
    size: {
      sm: { trigger: 'h-8 px-3 text-xs rounded-l1' },
      md: { trigger: 'h-control-h px-3 text-control rounded-l2' },
      lg: { trigger: 'h-12 px-4 text-base rounded-l3' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type SelectVariants = VariantProps<typeof selectStyles>;

interface SelectTriggerFieldProps
  extends Omit<SelectTriggerProps, 'size'>,
    Pick<SelectVariants, 'size'> {
  placeholder?: string;
}

const SelectRoot = (props: React.ComponentProps<typeof ArkSelect.Root<CollectionItem>>) => (
  <ArkSelect.Root {...props} />
);

const SelectTriggerField = ({
  className,
  size,
  placeholder,
  children,
  ...props
}: SelectTriggerFieldProps) => {
  const { trigger, valueText } = selectStyles({ size });
  return (
    <ArkSelect.Trigger className={trigger({ className })} {...props}>
      <ArkSelect.ValueText className={valueText()} placeholder={placeholder} />
      <ChevronDown size={14} className="text-fg-muted" />
      {children}
    </ArkSelect.Trigger>
  );
};

const SelectContent = ({ className, ...props }: SelectContentProps) => {
  const { content } = selectStyles();
  return <ArkSelect.Content className={content({ className })} {...props} />;
};

const SelectItem = ({ className, ...props }: SelectItemProps) => {
  const { item } = selectStyles();
  return <ArkSelect.Item className={item({ className })} {...props} />;
};

const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
  const { label } = selectStyles();
  return <ArkSelect.Label className={label({ className })} {...props} />;
};

export {
  createListCollection,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTriggerField,
};
