import { createListCollection } from '@ark-ui/react/collection';
import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTriggerField } from './select';

const meta: Meta = {
  title: 'UI/Select',
};

export default meta;

const collection = createListCollection({
  items: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'carrot', label: 'Carrot' },
    { value: 'broccoli', label: 'Broccoli' },
  ],
});

export const Playground: StoryObj = {
  render: () => (
    <SelectRoot collection={collection}>
      <SelectTriggerField size="md" placeholder="Select an option">
        <SelectContent>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem item="apple">Apple</SelectItem>
          <SelectItem item="banana">Banana</SelectItem>
          <SelectItem item="cherry">Cherry</SelectItem>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem item="carrot">Carrot</SelectItem>
          <SelectItem item="broccoli">Broccoli</SelectItem>
        </SelectContent>
      </SelectTriggerField>
    </SelectRoot>
  ),
};
