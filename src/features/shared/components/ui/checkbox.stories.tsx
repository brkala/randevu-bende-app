import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useState } from 'react';
import { CheckboxField } from './checkbox';

const meta: Meta<typeof CheckboxField> = {
  component: CheckboxField,
  title: 'UI/Checkbox',
};

export default meta;

type Story = StoryObj<typeof CheckboxField>;

export const Playground: Story = {
  args: { size: 'md' },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  render: ({ size }) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckboxField
        size={size}
        label="Accept Terms"
        checked={checked}
        onCheckedChange={({ checked: c }) => setChecked(c === true)}
      />
    );
  },
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <h1 className="text-3xl font-serif font-bold">Checkbox Gallery</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">States</h2>
        <div className="flex flex-col gap-3">
          <CheckboxField label="Unchecked" />
          <CheckboxField label="Checked" defaultChecked />
          <CheckboxField label="Disabled" disabled />
          <CheckboxField label="Checked Disabled" defaultChecked disabled />
          <CheckboxField label="Indeterminate" indeterminate />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex flex-col gap-3">
          <CheckboxField size="sm" label="Small" />
          <CheckboxField size="md" label="Medium" />
          <CheckboxField size="lg" label="Large" />
        </div>
      </section>
    </div>
  ),
};
