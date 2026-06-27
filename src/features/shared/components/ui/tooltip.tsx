import {
  Tooltip as ArkTooltip,
  type TooltipArrowProps,
  type TooltipContentProps,
  type TooltipRootProps,
  type TooltipTriggerProps,
} from '@ark-ui/react/tooltip';
import { tv } from '@/features/style/utils/tv';

const tooltipStyles = tv({
  slots: {
    content: 'bg-bg-inverse text-fg-inverse text-xs px-3 py-1.5 rounded-l2 shadow-md z-50 max-w-xs',
    arrow: '',
    arrowTip: '',
  },
});

const TooltipRoot = (props: TooltipRootProps) => <ArkTooltip.Root {...props} />;
const TooltipTrigger = (props: TooltipTriggerProps) => <ArkTooltip.Trigger {...props} />;

const TooltipContent = ({ className, ...props }: TooltipContentProps) => {
  const { content } = tooltipStyles();
  return <ArkTooltip.Content className={content({ className })} {...props} />;
};

const TooltipArrow = ({ className, ...props }: TooltipArrowProps) => {
  const { arrow } = tooltipStyles();
  return (
    <ArkTooltip.Arrow className={arrow({ className })} {...props}>
      <ArkTooltip.ArrowTip />
    </ArkTooltip.Arrow>
  );
};

export { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger };
