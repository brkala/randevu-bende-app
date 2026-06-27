import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Button } from './button';
import { FieldInput, FieldLabel, FieldRoot } from './field';
import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from './popover';

const meta = {
  title: 'UI/Popover',
  component: PopoverRoot,
} satisfies Meta;

export default meta;

export const Playground: StoryObj = {
  render: () => (
    <div className="flex items-center justify-center min-h-[300px]">
      <PopoverRoot>
        <PopoverTrigger asChild>
          <Button variant="default">Open Popover</Button>
        </PopoverTrigger>
        <PopoverPositioner>
          <PopoverContent>
            <div className="space-y-3 min-w-[240px]">
              <h3 className="text-sm font-semibold text-fg-default">Profile</h3>
              <p className="text-xs text-fg-muted">This is a popover. Click outside to close.</p>
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverRoot>
    </div>
  ),
};

export const Overview: StoryObj = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Popover Gallery</h1>
        <p className="text-fg-muted">Popover displays content in a floating panel.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Simple</h2>
        <div className="flex gap-4 items-center">
          <PopoverRoot>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">
                Info
              </Button>
            </PopoverTrigger>
            <PopoverPositioner>
              <PopoverContent>
                <p className="text-sm text-fg-default">Simple informational popover.</p>
              </PopoverContent>
            </PopoverPositioner>
          </PopoverRoot>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">With Form</h2>
        <PopoverRoot>
          <PopoverTrigger asChild>
            <Button variant="accent" size="sm">
              Edit Name
            </Button>
          </PopoverTrigger>
          <PopoverPositioner>
            <PopoverContent>
              <div className="space-y-3 min-w-[220px]">
                <h3 className="text-sm font-semibold text-fg-default">Edit Name</h3>
                <FieldRoot>
                  <FieldLabel>Name</FieldLabel>
                  <FieldInput placeholder="Enter your name" size="sm" />
                </FieldRoot>
                <div className="flex gap-2 justify-end">
                  <Button variant="default" size="sm">
                    Cancel
                  </Button>
                  <Button variant="accent" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverRoot>
      </section>
    </div>
  ),
};
