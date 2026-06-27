import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof Separator>;

export const Playground: Story = {};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Separator Gallery</h1>
        <p className="text-fg-muted">Horizontal and vertical separators.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Horizontal</h2>
        <div className="space-y-2">
          <p>Content above separator</p>
          <Separator />
          <p>Content below separator</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Vertical</h2>
        <div className="flex items-center gap-4 h-12">
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Center</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </section>
    </div>
  ),
};
