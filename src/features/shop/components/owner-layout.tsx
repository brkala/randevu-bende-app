import { LayoutDashboard, Users } from 'lucide-react';
import { useHeaderDrawerContext } from '@/features/header/contexts/header-drawer.context';
import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
} from '@/features/shared/components/ui/drawer';

interface OwnerLayoutProps {
  shopId: string;
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Çalışanlar', icon: Users },
];

function SidebarNav({
  currentTab,
  onTabChange,
  onItemClick,
}: {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onItemClick?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            data-testid={`owner-tab-${item.id}`}
            onClick={() => {
              onTabChange(item.id);
              onItemClick?.();
            }}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-l2 transition-colors duration-normal cursor-pointer ${
              isActive
                ? 'bg-accent-default text-accent-fg font-medium'
                : 'text-fg-default hover:bg-bg-hover'
            }`}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function OwnerLayout({ shopId, currentTab, onTabChange, children }: OwnerLayoutProps) {
  const { open, setOpen } = useHeaderDrawerContext();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]" data-shop-id={shopId}>
      {/* Desktop sidebar */}
      <aside className="hidden sm:block w-56 border-r border-border-default bg-bg-canvas p-4 flex-shrink-0">
        <SidebarNav currentTab={currentTab} onTabChange={onTabChange} />
      </aside>

      {/* Mobile drawer — trigger is in the header */}
      <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} swipeDirection={'left' as any}>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerTitle>Panel</DrawerTitle>
            <DrawerCloseTrigger />
            <div className="px-4 py-2">
              <SidebarNav
                currentTab={currentTab}
                onTabChange={onTabChange}
                onItemClick={() => setOpen(false)}
              />
            </div>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>

      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
