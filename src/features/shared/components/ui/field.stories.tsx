import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { FieldErrorText, FieldHelperText, FieldInput, FieldLabel, FieldRoot } from './field';

interface PlaygroundArgs {
  label: string;
  placeholder: string;
  size: 'sm' | 'md' | 'lg';
  state: 'default' | 'error' | 'success';
  disabled: boolean;
  required: boolean;
}

const defaultArgs: PlaygroundArgs = {
  label: 'Email',
  placeholder: 'ornek@email.com',
  size: 'md',
  state: 'default',
  disabled: false,
  required: false,
};

const meta: Meta<PlaygroundArgs> = {
  title: 'UI/Field',
  component: FieldRoot,
  args: defaultArgs,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'error', 'success'] },
  },
};

export default meta;

type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  render: ({ label, placeholder, size, state, disabled, required }) => (
    <div className="flex flex-col gap-4 max-w-xs">
      <FieldRoot disabled={disabled} required={required} invalid={state === 'error'}>
        <FieldLabel>{label}</FieldLabel>
        <FieldInput placeholder={placeholder} size={size} state={state} disabled={disabled} />
        {state === 'error' ? (
          <FieldErrorText>This field has an error.</FieldErrorText>
        ) : (
          <FieldHelperText>Helper text for guidance.</FieldHelperText>
        )}
      </FieldRoot>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Field Gallery</h1>
        <p className="text-fg-muted">Showcase of Field input variants, sizes, and states.</p>
      </div>

      {/* Sizes */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <FieldRoot>
          <FieldLabel>Small (sm)</FieldLabel>
          <FieldInput placeholder="Small input" size="sm" />
        </FieldRoot>
        <FieldRoot>
          <FieldLabel>Medium (md)</FieldLabel>
          <FieldInput placeholder="Medium input" size="md" />
        </FieldRoot>
        <FieldRoot>
          <FieldLabel>Large (lg)</FieldLabel>
          <FieldInput placeholder="Large input" size="lg" />
        </FieldRoot>
      </section>

      {/* States */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">States</h2>
        <FieldRoot>
          <FieldLabel>Default</FieldLabel>
          <FieldInput placeholder="Default state" />
          <FieldHelperText>Helper text for guidance.</FieldHelperText>
        </FieldRoot>
        <FieldRoot invalid>
          <FieldLabel>Error</FieldLabel>
          <FieldInput placeholder="Error state" state="error" />
          <FieldErrorText>This field has an error.</FieldErrorText>
        </FieldRoot>
        <FieldRoot>
          <FieldLabel>Success</FieldLabel>
          <FieldInput placeholder="Success state" state="success" />
          <FieldHelperText>Looks good!</FieldHelperText>
        </FieldRoot>
        <FieldRoot>
          <FieldLabel>Disabled</FieldLabel>
          <FieldInput placeholder="Disabled input" disabled />
        </FieldRoot>
      </section>

      {/* Full width */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Full Width</h2>
        <FieldRoot>
          <FieldLabel>Full width input</FieldLabel>
          <FieldInput placeholder="Spans the container" />
        </FieldRoot>
      </section>
    </div>
  ),
};
