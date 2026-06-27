import {
  Tooltip as ArkTooltip,
  type TooltipArrowProps,
  type TooltipContentProps,
  type TooltipPositionerProps,
  type TooltipRootProps,
  type TooltipTriggerProps,
} from '@ark-ui/react/tooltip';
import { tv } from '@/features/style/utils/tv';

const tooltipStyles = tv({
  slots: {
    positioner: 'z-50 [--arrow-background:var(--color-inverse-surface)] [--arrow-size:6px]',
    content: 'bg-inverse-surface text-inverse-fg text-xs px-3 py-1.5 rounded-l2 shadow-md max-w-xs',
    arrow: 'text-inverse-surface',
    arrowTip: '',
  },
});

const TooltipRoot = (props: TooltipRootProps) => <ArkTooltip.Root {...props} />;
const TooltipTrigger = (props: TooltipTriggerProps) => <ArkTooltip.Trigger {...props} />;

const TooltipPositioner = ({ className, ...props }: TooltipPositionerProps) => {
  const { positioner } = tooltipStyles();
  return <ArkTooltip.Positioner className={positioner({ className })} {...props} />;
};

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

export { TooltipArrow, TooltipContent, TooltipPositioner, TooltipRoot, TooltipTrigger };
