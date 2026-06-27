import {
  Popover as ArkPopover,
  type PopoverAnchorProps,
  type PopoverContentProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from '@ark-ui/react/popover';
import { tv } from '@/features/style/utils/tv';

const popoverStyles = tv({
  slots: {
    content:
      'bg-bg-default border border-border-default rounded-l2 shadow-lg p-4 z-50 outline-none',
  },
});

const PopoverRoot = (props: PopoverRootProps) => <ArkPopover.Root {...props} />;
const PopoverTrigger = (props: PopoverTriggerProps) => <ArkPopover.Trigger {...props} />;
const PopoverAnchor = (props: PopoverAnchorProps) => <ArkPopover.Anchor {...props} />;

const PopoverContent = ({ className, ...props }: PopoverContentProps) => {
  const { content } = popoverStyles();
  return <ArkPopover.Content className={content({ className })} {...props} />;
};

export { PopoverAnchor, PopoverContent, PopoverRoot, PopoverTrigger };
