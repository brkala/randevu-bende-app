import {
  Tabs as ArkTabs,
  type TabContentProps,
  type TabListProps,
  type TabsRootProps,
  type TabTriggerProps,
} from '@ark-ui/react/tabs';
import { tv } from '@/features/style/utils/tv';

const tabsStyles = tv({
  slots: {
    root: '',
    list: 'flex gap-1 border-b border-border-default',
    trigger:
      'px-4 py-2 text-sm font-medium text-fg-muted border-b-2 border-transparent transition-colors duration-normal ease-enter cursor-pointer data-selected:text-accent-default data-selected:border-accent-default hover:text-fg-default',
    content: 'pt-4',
  },
});

const TabsRoot = (props: TabsRootProps) => <ArkTabs.Root {...props} />;

const TabsList = ({ className, ...props }: TabListProps) => {
  const { list } = tabsStyles();
  return <ArkTabs.List className={list({ className })} {...props} />;
};

const TabsTrigger = ({ className, ...props }: TabTriggerProps) => {
  const { trigger } = tabsStyles();
  return <ArkTabs.Trigger className={trigger({ className })} {...props} />;
};

const TabsContent = ({ className, ...props }: TabContentProps) => {
  const { content } = tabsStyles();
  return <ArkTabs.Content className={content({ className })} {...props} />;
};

export { TabsContent, TabsList, TabsRoot, TabsTrigger };
