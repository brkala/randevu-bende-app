import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Button } from './button';
import {
  createToaster,
  ToastActionTrigger,
  ToastCloseTrigger,
  ToastDescription,
  Toaster,
  ToastRoot,
  ToastTitle,
} from './toast';

const meta = {
  title: 'UI/Toast',
} satisfies Meta;

export default meta;

export const Playground: StoryObj = {
  render: () => {
    const toaster = createToaster({ placement: 'bottom-end' });

    return (
      <div className="min-h-75">
        <div className="flex flex-wrap gap-4">
          <Button
            variant="success"
            size="sm"
            onClick={() =>
              toaster.create({
                title: 'Başarılı',
                description: 'İşlem başarıyla tamamlandı.',
                type: 'success',
              })
            }
          >
            Success
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() =>
              toaster.create({
                title: 'Hata',
                description: 'Bir sorun oluştu, tekrar deneyin.',
                type: 'error',
              })
            }
          >
            Error
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={() =>
              toaster.create({
                title: 'Uyarı',
                description: 'Süreniz dolmak üzere.',
                type: 'warning',
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={() =>
              toaster.create({
                title: 'Bilgi',
                description: 'Yeni bir güncelleme mevcut.',
                type: 'info',
              })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toaster.create({
                title: 'Action ile',
                description: 'Bu toast bir aksiyon butonu içeriyor.',
                type: 'success',
                action: {
                  label: 'Geri Al',
                  onClick: () => console.log('Geri alındı'),
                },
              })
            }
          >
            With Action
          </Button>
        </div>
        <Toaster toaster={toaster}>
          {(toast) => (
            <ToastRoot>
              <div className="flex-1">
                <ToastTitle>{toast.title}</ToastTitle>
                {toast.description ? (
                  <ToastDescription>{toast.description}</ToastDescription>
                ) : null}
              </div>
              {toast.action ? <ToastActionTrigger>{toast.action.label}</ToastActionTrigger> : null}
              <ToastCloseTrigger />
            </ToastRoot>
          )}
        </Toaster>
      </div>
    );
  },
};

export const Overview: StoryObj = {
  render: () => {
    const toaster = createToaster({ placement: 'bottom-end', overlap: true });

    return (
      <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
        <h1 className="text-3xl font-serif font-bold">Toast Gallery</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border-default pb-2">Types</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="success"
              size="sm"
              onClick={() => toaster.success({ title: 'Success', description: 'Saved.' })}
            >
              Success
            </Button>
            <Button
              variant="error"
              size="sm"
              onClick={() => toaster.error({ title: 'Error', description: 'Failed.' })}
            >
              Error
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => toaster.warning({ title: 'Warning', description: 'Hurry up.' })}
            >
              Warning
            </Button>
            <Button
              variant="info"
              size="sm"
              onClick={() => toaster.info({ title: 'Info', description: 'New update.' })}
            >
              Info
            </Button>
          </div>
        </section>

        <Toaster toaster={toaster}>
          {(toast) => (
            <ToastRoot>
              <div className="flex-1">
                <ToastTitle>{toast.title}</ToastTitle>
                {toast.description ? (
                  <ToastDescription>{toast.description}</ToastDescription>
                ) : null}
              </div>
              {toast.action ? <ToastActionTrigger>{toast.action.label}</ToastActionTrigger> : null}
              <ToastCloseTrigger />
            </ToastRoot>
          )}
        </Toaster>
      </div>
    );
  },
};
