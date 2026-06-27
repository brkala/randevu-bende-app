import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'UI/Badge',
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  args: { variant: 'default', size: 'md' },
  argTypes: {
    variant: {
      options: ['default', 'accent', 'success', 'error', 'warning', 'info', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  render: ({ variant, size }) => (
    <Badge variant={variant} size={size}>
      Badge Text
    </Badge>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <h1 className="text-3xl font-serif font-bold">Badge Gallery</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Variants</h2>
        <div className="flex flex-wrap gap-3">
          {(
            [
              'default',
              'accent',
              'success',
              'error',
              'warning',
              'info',
              'outline',
              'ghost',
            ] as const
          ).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </section>
    </div>
  ),
};
