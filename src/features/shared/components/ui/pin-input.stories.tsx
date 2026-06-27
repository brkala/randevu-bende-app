import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { PinInputRoot } from './pin-input';

const meta = {
  title: 'UI/PinInput',
  component: PinInputRoot,
} satisfies Meta;

export default meta;

interface PlaygroundArgs {
  label: string;
  size: 'sm' | 'md' | 'lg';
  state: 'default' | 'error';
  errorText: string;
  count: number;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    label: 'Verification Code',
    size: 'md',
    state: 'default',
    errorText: 'Invalid code',
    count: 4,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'error'] },
    count: { control: { type: 'number', min: 3, max: 8 } },
    errorText: { control: 'text' },
    label: { control: 'text' },
  },
  render: ({ label, size, state, errorText, count }) => (
    <div className="max-w-xs">
      <PinInputRoot
        label={label}
        size={size}
        state={state === 'error' ? 'error' : undefined}
        errorText={state === 'error' ? errorText : undefined}
        count={count}
        onValueComplete={() => console.log('PIN completed')}
      />
    </div>
  ),
};

export const Overview: StoryObj = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">PinInput Gallery</h1>
        <p className="text-fg-muted">Single-character input fields for codes and PINs.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="space-y-6">
          <PinInputRoot label="Small (sm)" size="sm" />
          <PinInputRoot label="Medium (md)" size="md" />
          <PinInputRoot label="Large (lg)" size="lg" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Count</h2>
        <div className="space-y-6">
          <PinInputRoot label="4 digits" count={4} />
          <PinInputRoot label="6 digits" count={6} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">States</h2>
        <div className="space-y-6">
          <PinInputRoot label="Default" />
          <PinInputRoot label="Error" state="error" errorText="Invalid verification code" />
        </div>
      </section>
    </div>
  ),
};
