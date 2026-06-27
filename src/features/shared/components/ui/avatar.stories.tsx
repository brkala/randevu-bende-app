import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { AvatarField } from './avatar';

const meta: Meta<typeof AvatarField> = {
  component: AvatarField,
  title: 'UI/Avatar',
};

export default meta;

type Story = StoryObj<typeof AvatarField>;

export const Playground: Story = {
  args: { fallback: 'AB' },
  render: ({ fallback }) => <AvatarField fallback={fallback} className="w-10 h-10 text-sm" />,
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <h1 className="text-3xl font-serif font-bold">Avatar Gallery</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Variants</h2>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col items-center gap-2">
            <AvatarField fallback="CI" className="w-12 h-12 text-sm" variant="circle" />
            <span className="text-xs text-fg-muted">circle</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarField fallback="SQ" className="w-12 h-12 text-sm" variant="square" />
            <span className="text-xs text-fg-muted">square</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex gap-4 items-end">
          <AvatarField fallback="S" className="w-8 h-8 text-xs" />
          <AvatarField fallback="MD" className="w-10 h-10 text-sm" />
          <AvatarField fallback="LG" className="w-12 h-12 text-base" />
        </div>
      </section>
    </div>
  ),
};
