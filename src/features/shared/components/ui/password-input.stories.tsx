import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { PasswordInput } from './password-input';

const meta: Meta<typeof PasswordInput> = {
  component: PasswordInput,
  title: 'UI/PasswordInput',
};

export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Playground: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    size: 'md',
    state: 'default',
    errorText: '',
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    state: {
      options: ['default', 'error', 'success'],
      control: { type: 'select' },
    },
  },
  render: ({ label, placeholder, size, state }) => (
    <PasswordInput label={label} placeholder={placeholder} size={size} state={state} />
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Password Input Gallery</h1>
        <p className="text-fg-muted">Showcase of PasswordInput variants, sizes, and states.</p>
      </div>

      {/* Sizes */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <PasswordInput label="Small (sm)" placeholder="••••••••" size="sm" />
        <PasswordInput label="Medium (md)" placeholder="••••••••" size="md" />
        <PasswordInput label="Large (lg)" placeholder="••••••••" size="lg" />
      </section>

      {/* States */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">States</h2>
        <PasswordInput label="Default" placeholder="••••••••" />
        <PasswordInput
          label="Error"
          placeholder="••••••••"
          state="error"
          errorText="This field has an error."
        />
        <PasswordInput label="Success" placeholder="••••••••" state="success" />
        <PasswordInput label="Disabled" placeholder="••••••••" disabled />
      </section>
    </div>
  ),
};
