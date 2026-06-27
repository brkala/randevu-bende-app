import type { CollectionItem } from '@ark-ui/react/collection';
import { Listbox as ArkListbox } from '@ark-ui/react/listbox';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const listboxStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-fg-default select-none',
    content:
      'flex gap-3 p-3 overflow-x-auto bg-bg-canvas border border-border-default rounded-l2 min-h-[80px]',
    item: 'flex flex-col items-center gap-1.5 p-2 rounded-l1 cursor-pointer transition-colors duration-normal ease-enter hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent data-[state=selected]:bg-bg-active data-[state=selected]:ring-1 data-[state=selected]:ring-border-accent',
    itemLabel: 'text-xs text-fg-default text-center font-medium truncate max-w-[72px]',
    empty: 'flex items-center justify-center w-full text-sm text-fg-muted',
  },
  variants: {
    orientation: {
      horizontal: {
        content: 'flex-row',
        item: 'min-w-[72px]',
      },
      vertical: {
        content: 'flex-col',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const { root, label: labelClass, item: itemCn, itemLabel, empty } = listboxStyles();

interface ListboxRootFieldProps<T extends CollectionItem>
  extends ArkListbox.RootProps<T>,
    VariantProps<typeof listboxStyles> {
  label?: string;
}

export function ListboxRoot<T extends CollectionItem>({
  className,
  label: listLabel,
  orientation,
  ...props
}: ListboxRootFieldProps<T>) {
  const styles = listboxStyles({ orientation });
  return (
    <ArkListbox.Root className={root({ className })} {...props}>
      {listLabel ? <ArkListbox.Label className={labelClass()}>{listLabel}</ArkListbox.Label> : null}
      <ArkListbox.Content className={styles.content()}>{props.children}</ArkListbox.Content>
    </ArkListbox.Root>
  );
}

export function ListboxItem({ className, ...props }: ArkListbox.ItemProps) {
  return <ArkListbox.Item className={itemCn({ className })} {...props} />;
}

export function ListboxItemLabel({ className, ...props }: ArkListbox.ItemTextProps) {
  return <ArkListbox.ItemText className={itemLabel({ className })} {...props} />;
}

export function ListboxEmpty(props: ArkListbox.EmptyProps) {
  return <ArkListbox.Empty className={empty()} {...props} />;
}
