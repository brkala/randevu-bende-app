import {
  Dialog as ArkDialog,
  type DialogCloseTriggerProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from '@ark-ui/react/dialog';
import { X } from 'lucide-react';
import { tv } from '@/features/style/utils/tv';
import { Button } from './button';

const dialogStyles = tv({
  slots: {
    backdrop: 'fixed inset-0 bg-black/50 z-50',
    content:
      'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-default border border-border-default rounded-l3 shadow-xl z-50 p-6 w-full max-w-md outline-none',
    title: 'text-lg font-semibold text-fg-default mb-2',
    description: 'text-sm text-fg-muted mb-4',
    closeTrigger: 'absolute top-3 right-3',
  },
});

const DialogRoot = (props: DialogRootProps) => <ArkDialog.Root {...props} />;
const DialogTrigger = (props: DialogTriggerProps) => <ArkDialog.Trigger {...props} />;

const DialogContent = ({ className, ...props }: DialogContentProps) => {
  const { backdrop, content } = dialogStyles();
  return (
    <ArkDialog.Backdrop className={backdrop()}>
      <ArkDialog.Content className={content({ className })} {...props} />
    </ArkDialog.Backdrop>
  );
};

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  const { title } = dialogStyles();
  return <ArkDialog.Title className={title({ className })} {...props} />;
};

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  const { description } = dialogStyles();
  return <ArkDialog.Description className={description({ className })} {...props} />;
};

const DialogCloseTrigger = ({ className, ...props }: DialogCloseTriggerProps) => {
  const { closeTrigger } = dialogStyles();
  return (
    <ArkDialog.CloseTrigger className={closeTrigger({ className })} {...props} asChild>
      <Button variant="ghost" icon size="sm">
        <X />
      </Button>
    </ArkDialog.CloseTrigger>
  );
};

export {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
};
