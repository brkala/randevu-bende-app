import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Button } from './button';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const meta: Meta = {
  title: 'UI/Dialog',
};

export default meta;

export const Playground: StoryObj = {
  render: () => (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="accent">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>
          Are you sure you want to proceed? This action cannot be undone.
        </DialogDescription>
        <div className="flex gap-3 justify-end mt-6">
          <DialogCloseTrigger asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogCloseTrigger>
          <Button variant="error" size="sm">
            Delete
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  ),
};
