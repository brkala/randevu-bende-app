import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { AvatarField } from './avatar';

const meta: Meta<typeof AvatarField> = {
  component: AvatarField,
  title: 'UI/Avatar',
};

export default meta;

type Story = StoryObj<typeof AvatarField>;

export const Playground: Story = {
  args: { size: 'md', fallback: 'AB' },
  argTypes: {
    size: { options: ['sm', 'md', 'lg'], control: { type: 'select' } },
  },
  render: ({ size, fallback }) => <AvatarField size={size} fallback={fallback} />,
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <h1 className="text-3xl font-serif font-bold">Avatar Gallery</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex gap-4 items-end">
          <AvatarField size="sm" fallback="S" />
          <AvatarField size="md" fallback="MD" />
          <AvatarField size="lg" fallback="LG" />
        </div>
      </section>
    </div>
  ),
};
