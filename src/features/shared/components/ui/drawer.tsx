import {
  Drawer as ArkDrawer,
  type DrawerBackdropProps,
  type DrawerCloseTriggerProps,
  type DrawerContentProps,
  type DrawerDescriptionProps,
  type DrawerRootProps,
  type DrawerTitleProps,
  type DrawerTriggerProps,
} from '@ark-ui/react/drawer';
import { X } from 'lucide-react';
import { tv } from '@/features/style/utils/tv';
import { Button } from './button';

const drawerStyles = tv({
  slots: {
    backdrop:
      'fixed inset-0 bg-black/50 z-50 ' +
      'data-[state=open]:animate-[fade-in_0.5s_cubic-bezier(0.32,0.72,0,1)] ' +
      'data-[state=closed]:animate-[fade-out_0.3s_cubic-bezier(0.4,0,0.2,1)]',
    positioner:
      'fixed inset-0 flex items-end justify-center z-50 ' +
      "data-[swipe-direction='up']:items-start " +
      "data-[swipe-direction='left']:justify-start data-[swipe-direction='left']:items-stretch " +
      "data-[swipe-direction='right']:justify-end data-[swipe-direction='right']:items-stretch",
    content:
      'flex flex-col relative w-64 h-full bg-bg-default shadow-xl outline-none py-4 ' +
      'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ' +
      'rounded-t-2xl ' +
      "data-[swipe-direction='up']:rounded-t-none data-[swipe-direction='up']:rounded-b-2xl " +
      "data-[swipe-direction='left']:max-h-none data-[swipe-direction='left']:max-w-sm data-[swipe-direction='left']:rounded-l-none data-[swipe-direction='left']:rounded-r-2xl " +
      "data-[swipe-direction='right']:max-h-none data-[swipe-direction='right']:max-w-sm data-[swipe-direction='right']:rounded-r-none data-[swipe-direction='right']:rounded-l-2xl " +
      'data-[state=open]:animate-[slide-in-bottom_0.5s_cubic-bezier(0.32,0.72,0,1)] ' +
      'data-[state=closed]:animate-[slide-out-bottom_0.3s_cubic-bezier(0.4,0,0.2,1)] ' +
      "data-[swipe-direction='up']:data-[state=open]:animate-[slide-in-top_0.5s_cubic-bezier(0.32,0.72,0,1)] " +
      "data-[swipe-direction='up']:data-[state=closed]:animate-[slide-out-top_0.3s_cubic-bezier(0.4,0,0.2,1)] " +
      "data-[swipe-direction='left']:data-[state=open]:animate-[slide-in-left_0.5s_cubic-bezier(0.32,0.72,0,1)] " +
      "data-[swipe-direction='left']:data-[state=closed]:animate-[slide-out-left_0.3s_cubic-bezier(0.4,0,0.2,1)] " +
      "data-[swipe-direction='right']:data-[state=open]:animate-[slide-in-right_0.5s_cubic-bezier(0.32,0.72,0,1)] " +
      "data-[swipe-direction='right']:data-[state=closed]:animate-[slide-out-right_0.3s_cubic-bezier(0.4,0,0.2,1)] ",
    title: 'px-4 text-lg font-medium leading-7 mb-2 text-fg-default',
    description: 'mt-1 mb-0 text-sm leading-relaxed text-fg-muted',
    closeTrigger: 'absolute top-3 right-3',
  },
});

const { backdrop, positioner, content, title, description, closeTrigger } = drawerStyles();

const DrawerRoot = (props: DrawerRootProps) => <ArkDrawer.Root {...props} />;
const DrawerTrigger = (props: DrawerTriggerProps) => <ArkDrawer.Trigger {...props} />;

const DrawerBackdrop = ({ className, ...props }: DrawerBackdropProps) => (
  <ArkDrawer.Backdrop className={backdrop({ className })} {...props} />
);

const DrawerPositioner = ({ className, ...props }: ArkDrawer.PositionerProps) => (
  <ArkDrawer.Positioner className={positioner({ className })} {...props} />
);

const DrawerContent = ({ className, ...props }: DrawerContentProps) => (
  <ArkDrawer.Content className={content({ className })} {...props} />
);

const DrawerTitle = ({ className, ...props }: DrawerTitleProps) => (
  <ArkDrawer.Title className={title({ className })} {...props} />
);

const DrawerDescription = ({ className, ...props }: DrawerDescriptionProps) => (
  <ArkDrawer.Description className={description({ className })} {...props} />
);

const DrawerCloseTrigger = ({ className, ...props }: DrawerCloseTriggerProps) => (
  <ArkDrawer.CloseTrigger className={closeTrigger({ className })} {...props} asChild>
    <Button variant="ghost" icon size="sm">
      <X />
    </Button>
  </ArkDrawer.CloseTrigger>
);

export {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
};
