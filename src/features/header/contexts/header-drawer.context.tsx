import constate from 'constate';
import { useState } from 'react';

function useHeaderDrawer() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

export const [HeaderDrawerProvider, useHeaderDrawerContext] = constate(useHeaderDrawer);
