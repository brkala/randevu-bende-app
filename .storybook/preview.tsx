import type { Preview } from '@storybook/tanstack-react';
import { LucideProvider } from '../src/features/style/components/lucide-provider';
import '../src/features/style/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <LucideProvider>
        <Story />
      </LucideProvider>
    ),
  ],
};

export default preview;
