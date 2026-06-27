import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { RadioGroupItem, RadioGroupRoot } from './radio-group';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroupRoot,
} satisfies Meta;

export default meta;

interface PlaygroundArgs {
  defaultValue: string;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: { defaultValue: 'option-1' },
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
    },
  },
  render: ({ defaultValue }) => (
    <div className="max-w-xs">
      <RadioGroupRoot defaultValue={defaultValue}>
        <RadioGroupItem value="option-1">Option 1</RadioGroupItem>
        <RadioGroupItem value="option-2">Option 2</RadioGroupItem>
        <RadioGroupItem value="option-3">Option 3</RadioGroupItem>
      </RadioGroupRoot>
    </div>
  ),
};

export const Overview: StoryObj = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Radio Group Gallery</h1>
        <p className="text-fg-muted">Radio button groups for single selection.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Default</h2>
        <RadioGroupRoot defaultValue="item-1">
          <RadioGroupItem value="item-1">Default selected</RadioGroupItem>
          <RadioGroupItem value="item-2">Second option</RadioGroupItem>
          <RadioGroupItem value="item-3">Third option</RadioGroupItem>
        </RadioGroupRoot>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Disabled Item</h2>
        <RadioGroupRoot defaultValue="active">
          <RadioGroupItem value="active">Active option</RadioGroupItem>
          <RadioGroupItem value="disabled" disabled>
            Disabled option
          </RadioGroupItem>
        </RadioGroupRoot>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          Multiple Groups
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-fg-default mb-2">Delivery Method</h3>
            <RadioGroupRoot defaultValue="standard">
              <RadioGroupItem value="standard">Standard (3-5 days)</RadioGroupItem>
              <RadioGroupItem value="express">Express (1-2 days)</RadioGroupItem>
              <RadioGroupItem value="overnight">Overnight</RadioGroupItem>
            </RadioGroupRoot>
          </div>
          <div>
            <h3 className="text-sm font-medium text-fg-default mb-2">Payment</h3>
            <RadioGroupRoot defaultValue="card">
              <RadioGroupItem value="card">Credit Card</RadioGroupItem>
              <RadioGroupItem value="transfer">Bank Transfer</RadioGroupItem>
            </RadioGroupRoot>
          </div>
        </div>
      </section>
    </div>
  ),
};
