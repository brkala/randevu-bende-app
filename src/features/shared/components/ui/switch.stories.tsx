import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { SwitchField } from './switch';

const meta: Meta<typeof SwitchField> = {
  component: SwitchField,
  title: 'UI/Switch',
};

export default meta;

type Story = StoryObj<typeof SwitchField>;

export const Playground: Story = {
  args: { size: 'md', label: 'Enable Notifications' },
  argTypes: {
    size: { options: ['sm', 'md', 'lg'], control: { type: 'select' } },
  },
  render: ({ size, label }) => <SwitchField size={size} label={label} />,
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <h1 className="text-3xl font-serif font-bold">Switch Gallery</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex flex-col gap-3">
          <SwitchField size="sm" label="Small" />
          <SwitchField size="md" label="Medium" defaultChecked />
          <SwitchField size="lg" label="Large" />
        </div>
      </section>
    </div>
  ),
};
