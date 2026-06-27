import { createListCollection } from '@ark-ui/react/collection';
import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { AvatarField } from './avatar';
import { ListboxEmpty, ListboxItem, ListboxItemLabel, ListboxRoot } from './listbox';

const meta = {
  title: 'UI/Listbox',
  component: ListboxRoot,
} satisfies Meta;

export default meta;

type Story = StoryObj;

const mockItems = [
  { value: '1', label: 'Ahmet Usta', initials: 'AU' },
  { value: '2', label: 'Mehmet Bey', initials: 'MB' },
  { value: '3', label: 'Ali Rıza', initials: 'AR' },
  { value: '4', label: 'Veli Can', initials: 'VC' },
  { value: '5', label: 'Zeynep Hanım', initials: 'ZH' },
];

const mockCollection = createListCollection({ items: mockItems });
const emptyCollection = createListCollection({ items: [] });

export const Playground: Story = {
  render: () => (
    <div className="max-w-xl mx-auto p-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <ListboxRoot collection={mockCollection} label="Çalışanlar" orientation="horizontal">
        {mockItems.map((item) => (
          <ListboxItem key={item.value} item={item}>
            <AvatarField fallback={item.initials} className="w-12 h-12 text-sm" variant="square" />
            <ListboxItemLabel>{item.label}</ListboxItemLabel>
          </ListboxItem>
        ))}
        <ListboxEmpty>Çalışan bulunamadı</ListboxEmpty>
      </ListboxRoot>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Listbox Gallery</h1>
        <p className="text-fg-muted">Horizontal list for employee selection.</p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">
          Horizontal (default)
        </h2>
        <ListboxRoot
          collection={createListCollection({
            items: mockItems.slice(0, 4),
          })}
          label="Çalışanlar"
          orientation="horizontal"
        >
          {mockItems.slice(0, 4).map((item) => (
            <ListboxItem key={item.value} item={item}>
              <AvatarField
                fallback={item.initials}
                className="w-12 h-12 text-sm"
                variant="square"
              />
              <ListboxItemLabel>{item.label}</ListboxItemLabel>
            </ListboxItem>
          ))}
        </ListboxRoot>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Empty State</h2>
        <ListboxRoot collection={emptyCollection} orientation="horizontal">
          <ListboxEmpty>Henüz çalışan bulunmuyor</ListboxEmpty>
        </ListboxRoot>
      </section>
    </div>
  ),
};
