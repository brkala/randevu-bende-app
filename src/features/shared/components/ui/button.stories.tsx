import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Plus, Settings, Trash } from 'lucide-react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI/Button',
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    fullWidth: false,
    icon: false,
  },
  argTypes: {
    variant: {
      options: ['default', 'accent', 'success', 'error', 'warning', 'info', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'boolean' },
    },
  },
  render: ({ variant, size, fullWidth, icon, ...props }) => (
    <Button variant={variant} size={size} fullWidth={fullWidth} icon={icon} {...props}>
      {icon ? <Plus className="size-4" /> : 'Button Text'}
    </Button>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Button Gallery</h1>
        <p className="text-fg-muted">
          Showcase of all button variants, sizes, states, and options.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">Default</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="success">Success</Button>
          <Button variant="error">Error</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">Small (sm)</span>
            <Button size="sm">Small Button</Button>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">Medium (md)</span>
            <Button size="md">Medium Button</Button>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">Large (lg)</span>
            <Button size="lg">Large Button</Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          Icon Buttons (Square)
        </h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">sm</span>
            <Button size="sm" icon>
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">md</span>
            <Button size="md" icon>
              <Settings className="size-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs text-fg-muted">lg</span>
            <Button size="lg" icon>
              <Trash className="size-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          States (Disabled)
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default" disabled>
            Default
          </Button>
          <Button variant="accent" disabled>
            Accent
          </Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Full Width</h2>
        <div className="max-w-md space-y-2">
          <Button variant="accent" fullWidth>
            Full Width Button
          </Button>
          <Button variant="default" fullWidth>
            Full Width Button
          </Button>
        </div>
      </section>
    </div>
  ),
};
