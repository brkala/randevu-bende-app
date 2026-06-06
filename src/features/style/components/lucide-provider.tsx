import { LucideProvider as BaseLucideProvider } from 'lucide-react';
import type { ReactNode } from 'react';

export const lucideConfig = {
  strokeWidth: 2,
  size: 20,
};

export function LucideProvider({ children }: { children: ReactNode }) {
  return (
    <BaseLucideProvider strokeWidth={lucideConfig.strokeWidth} size={lucideConfig.size}>
      {children}
    </BaseLucideProvider>
  );
}
