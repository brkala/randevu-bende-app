import {
  Menu as ArkMenu,
  type MenuItemGroupLabelProps,
  type MenuItemGroupProps,
  type MenuItemProps,
  type MenuPositionerProps,
  type MenuRootProps,
  type MenuSeparatorProps,
  type MenuTriggerItemProps,
  type MenuTriggerProps,
} from '@ark-ui/react/menu';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const menuStyles = tv({
  slots: {
    positioner: 'z-50',
    content:
      'bg-bg-default border border-border-default rounded-l2 shadow-lg py-1 min-w-45 outline-none',
    item: 'bg-bg-default flex items-center gap-2 px-3 py-2 text-sm text-fg-default cursor-pointer transition-colors duration-normal ease-enter outline-none hover:bg-bg-hover focus:bg-bg-hover data-disabled:opacity-50 data-disabled:pointer-events-none',
    itemGroup: '',
    itemGroupLabel: 'px-3 py-1.5 text-xs text-fg-muted font-medium',
    separator: 'h-px bg-border-default my-1 mx-3 border-none',
    triggerItem:
      'flex items-center gap-2 px-3 py-2 text-sm text-fg-default cursor-pointer transition-colors duration-normal ease-enter outline-none hover:bg-bg-hover focus:bg-bg-hover data-disabled:opacity-50 data-disabled:pointer-events-none justify-between',
  },
  variants: {
    size: {
      sm: {
        item: 'text-xs px-2.5 py-1.5',
        triggerItem: 'text-xs px-2.5 py-1.5',
      },
      md: {},
      lg: {
        item: 'px-4 py-3',
        triggerItem: 'px-4 py-3',
      },
    },
  },
});

type MenuVariants = VariantProps<typeof menuStyles>;

const MenuRoot = (props: MenuRootProps) => <ArkMenu.Root {...props} />;

const MenuTrigger = ({
  className,
  size,
  ...props
}: MenuTriggerProps & Pick<MenuVariants, 'size'>) => {
  return <ArkMenu.Trigger className={className} {...props} />;
};

const MenuPositioner = ({ className, ...props }: MenuPositionerProps) => {
  const { positioner } = menuStyles();
  return <ArkMenu.Positioner className={positioner({ className })} {...props} />;
};

const MenuContent = forwardRef<
  ComponentRef<typeof ArkMenu.Content>,
  ComponentPropsWithoutRef<typeof ArkMenu.Content>
>(({ className, ...props }, ref) => {
  const { content } = menuStyles();
  return <ArkMenu.Content ref={ref} className={content({ className })} {...props} />;
});
MenuContent.displayName = 'MenuContent';

const MenuItem = ({ className, ...props }: MenuItemProps) => {
  const { item } = menuStyles();
  return <ArkMenu.Item className={item({ className })} {...props} />;
};

const MenuItemGroup = ({ className, ...props }: MenuItemGroupProps) => {
  const { itemGroup } = menuStyles();
  return <ArkMenu.ItemGroup className={itemGroup({ className })} {...props} />;
};

const MenuItemGroupLabel = ({ className, ...props }: MenuItemGroupLabelProps) => {
  const { itemGroupLabel } = menuStyles();
  return <ArkMenu.ItemGroupLabel className={itemGroupLabel({ className })} {...props} />;
};

const MenuSeparator = ({ className, ...props }: MenuSeparatorProps) => {
  const { separator } = menuStyles();
  return <ArkMenu.Separator className={separator({ className })} {...props} />;
};

const MenuTriggerItem = ({ className, ...props }: MenuTriggerItemProps) => {
  const { triggerItem } = menuStyles();
  return <ArkMenu.TriggerItem className={triggerItem({ className })} {...props} />;
};

export {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
};
