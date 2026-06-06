import { createTV } from 'tailwind-variants';

export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        'font-size': ['text-control'],
        'font-weight': ['font-control'],
      },
    },
  },
});
