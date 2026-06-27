import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from './tabs';

const meta: Meta = {
  title: 'UI/Tabs',
};

export default meta;

export const Playground: StoryObj = {
  render: () => (
    <TabsRoot defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Settings</TabsTrigger>
        <TabsTrigger value="tab3">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-fg-default">Overview content here.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-fg-default">Settings content here.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-fg-default">Billing content here.</p>
      </TabsContent>
    </TabsRoot>
  ),
};
