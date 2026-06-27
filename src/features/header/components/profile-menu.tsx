import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouteContext, useRouter } from '@tanstack/react-router';
import { ChevronRight, LogOut, Settings, Store, User } from 'lucide-react';
import type { auth } from '@/features/auth/auth.server';
import { signOut } from '@/features/auth/auth-client';
import { Button } from '@/features/shared/components/ui/button';
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
} from '@/features/shared/components/ui/menu';

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

interface ShopInfo {
  id: string;
  name: string;
  slug: string;
  role: 'owner' | 'employee' | 'manager';
}

interface OrgInfo {
  id: string;
  name?: string | null;
  slug?: string | null;
}

interface MembershipInfo {
  organizationId: string;
  role: string;
  organization?: { slug?: string | null };
}

type SessionWithOrgs = Session & {
  memberships?: MembershipInfo[];
  organizations?: OrgInfo[];
};

function extractShops(session: Session | null): ShopInfo[] {
  if (!session) return [];

  const sess = session as SessionWithOrgs;
  const memberships: MembershipInfo[] = sess.memberships ?? [];
  const organizations: OrgInfo[] = sess.organizations ?? [];

  return organizations.map((org: OrgInfo) => {
    const membership = memberships.find((m: MembershipInfo) => m.organizationId === org.id);
    return {
      id: org.id,
      name: org.name ?? 'Dükkan',
      slug: org.slug ?? org.id,
      role: (membership?.role as 'owner' | 'employee' | 'manager') ?? 'employee',
    };
  });
}

export function ProfileMenu() {
  const { auth } = useRouteContext({ from: '__root__' });
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = auth?.user;

  if (!user) return null;

  const shops = extractShops(auth);
  const displayName = user.name || user.email?.split('@')[0] || 'Kullanıcı';
  const hasSingleShop = shops.length === 1;
  const hasMultipleShops = shops.length > 1;

  const handleLogout = async () => {
    await signOut();
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    router.navigate({ to: '/' });
  };

  return (
    <MenuRoot closeOnSelect>
      <MenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-subtle text-xs font-semibold text-fg-muted">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <span>{displayName}</span>
        </Button>
      </MenuTrigger>

      <MenuPositioner>
        <MenuContent>
          <MenuItem value="profile" asChild>
            <Link to="/profile">
              <User size={16} />
              Profilim
            </Link>
          </MenuItem>

          <MenuItem value="settings" asChild>
            <Link to="/settings">
              <Settings size={16} />
              Ayarlar
            </Link>
          </MenuItem>

          {hasSingleShop ? (
            <MenuItem value={shops[0].slug} asChild>
              <Link to="/shops/$shopId" params={{ shopId: shops[0].slug }}>
                <Store size={16} />
                {shops[0].name}
              </Link>
            </MenuItem>
          ) : hasMultipleShops ? (
            <MenuRoot positioning={{ placement: 'right-start' }} closeOnSelect>
              <MenuTriggerItem>
                <span className="flex items-center gap-2">
                  <Store size={16} />
                  Dükkanlar
                </span>
                <ChevronRight size={14} />
              </MenuTriggerItem>

              <MenuPositioner>
                <MenuContent>
                  {shops.map((shop) => (
                    <MenuItem key={shop.id} value={shop.slug} asChild>
                      <Link to="/shops/$shopId" params={{ shopId: shop.slug }}>
                        <Store size={14} />
                        {shop.name}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          ) : null}

          <MenuSeparator />

          <MenuItem value="logout" onSelect={handleLogout}>
            <span className="flex items-center gap-2 text-error-default">
              <LogOut size={16} />
              Çıkış Yap
            </span>
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
}
