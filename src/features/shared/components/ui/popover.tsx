import {
  Popover as ArkPopover,
  type PopoverAnchorProps,
  type PopoverContentProps,
  type PopoverPositionerProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from '@ark-ui/react/popover';
import { tv } from '@/features/style/utils/tv';

const popoverStyles = tv({
  slots: {
    positioner: 'z-50',
    content:
      'bg-bg-default border border-border-default rounded-l2 shadow-lg p-4 z-50 outline-none',
  },
});

const PopoverRoot = (props: PopoverRootProps) => <ArkPopover.Root {...props} />;
const PopoverTrigger = (props: PopoverTriggerProps) => <ArkPopover.Trigger {...props} />;
const PopoverAnchor = (props: PopoverAnchorProps) => <ArkPopover.Anchor {...props} />;

const PopoverPositioner = ({ className, ...props }: PopoverPositionerProps) => {
  const { positioner } = popoverStyles();
  return <ArkPopover.Positioner className={positioner({ className })} {...props} />;
};

const PopoverContent = ({ className, ...props }: PopoverContentProps) => {
  const { content } = popoverStyles();
  return <ArkPopover.Content className={content({ className })} {...props} />;
};

export { PopoverAnchor, PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger };
