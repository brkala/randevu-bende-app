import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useRouteContext, useRouter } from '@tanstack/react-router';
import { ChevronRight, LogOut, Mail, Settings, Store, User } from 'lucide-react';
import { useState } from 'react';
import type { auth } from '@/features/auth/auth.server';
import { signOut } from '@/features/auth/auth-client';
import { Button } from '@/features/shared/components/ui/button';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { Field } from '@/features/shared/components/ui/field';
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
} from '@/features/shared/components/ui/menu';
import { CreateShopDialog } from '@/features/shop/components/create-shop-dialog';
import { acceptInvitationFn, rejectInvitationFn } from '@/features/shop/shop.functions';
import { shopKeys, shopQueries } from '@/features/shop/shop.queries';
import { toaster } from '@/features/toast/toast';

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

function InvitationsMenuItem() {
  const { auth } = useRouteContext({ from: '__root__' });
  const { data: invitations } = useQuery(shopQueries.myInvitations());
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptInvitationFn,
    onSuccess: () => {
      toaster.create({
        title: 'Davet kabul edildi',
        description: 'Dükkana başarıyla katıldınız.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: shopKeys.myInvitations() });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (err) => {
      toaster.create({
        title: 'Hata',
        description: err instanceof Error ? err.message : 'Davet kabul edilemedi',
        type: 'error',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectInvitationFn,
    onSuccess: () => {
      toaster.create({ title: 'Davet reddedildi', type: 'info' });
      queryClient.invalidateQueries({ queryKey: shopKeys.myInvitations() });
    },
  });

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  const pendingCount = invitations?.length ?? 0;
  if (pendingCount === 0) return null;

  const handleAccept = () => {
    if (!acceptingId || !displayName.trim()) return;
    acceptMutation.mutate({ data: { invitationId: acceptingId, displayName: displayName.trim() } });
  };

  return (
    <>
      <MenuRoot positioning={{ placement: 'right-start' }} closeOnSelect>
        <MenuTriggerItem data-testid="invitations-submenu-trigger">
          <span className="flex items-center gap-2">
            <span className="relative">
              <Mail size={16} />
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-2xs font-bold bg-accent-default text-accent-fg rounded-full"
                data-testid="invitation-badge"
              >
                {pendingCount}
              </span>
            </span>
            Davetlerim
          </span>
          <ChevronRight size={14} />
        </MenuTriggerItem>
        <MenuPositioner>
          <MenuContent>
            {invitations?.map((inv) => (
              <div
                key={inv.id}
                className="px-2 py-2 border-b border-border-default last:border-b-0"
              >
                <p className="text-sm font-medium text-fg-default">
                  {inv.shop.title ?? 'Bir dükkan'}
                </p>
                <p className="text-xs text-fg-muted">
                  {inv.invitedBy.name} tarafından davet edildin
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="xs"
                    variant="accent"
                    data-testid="invitation-accept-button"
                    onClick={() => {
                      setAcceptingId(inv.id);
                      setDisplayName(auth?.user?.name || 'Bilinmeyen İsim');
                      setAcceptDialogOpen(true);
                    }}
                  >
                    Kabul Et
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => rejectMutation.mutate({ data: { invitationId: inv.id } })}
                  >
                    Reddet
                  </Button>
                </div>
              </div>
            ))}
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>

      <DialogRoot open={acceptDialogOpen} onOpenChange={(e) => setAcceptDialogOpen(e.open)}>
        <DialogContent>
          <DialogTitle>Daveti Kabul Et</DialogTitle>
          <DialogDescription>Bu dükkanda görünecek isminizi girin.</DialogDescription>
          <div className="space-y-4 mt-4">
            <Field label="Görünür İsim" required>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Örn: Ahmet Usta"
                className="w-full h-control-h px-3 text-control bg-bg-default border border-border-default rounded-l2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent"
                data-testid="accept-display-name-input"
              />
            </Field>
            {acceptMutation.isError ? (
              <p className="text-sm text-error-default">
                {acceptMutation.error instanceof Error
                  ? acceptMutation.error.message
                  : 'Davet kabul edilemedi'}
              </p>
            ) : null}
            <div className="flex gap-3 justify-end">
              <DialogCloseTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  İptal
                </Button>
              </DialogCloseTrigger>
              <Button
                variant="accent"
                size="sm"
                data-testid="accept-submit"
                disabled={!displayName.trim() || acceptMutation.isPending}
                onClick={handleAccept}
              >
                {acceptMutation.isPending ? 'Kabul ediliyor...' : 'Kabul Et'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

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
  const displayName = user.name || 'Bilinmeyen İsim';
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
        <Button variant="ghost" size="sm" data-testid="profile-menu-trigger">
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

          {/* Dükkan Oluştur */}
          <MenuItem value="create-shop" onSelect={() => {}} closeOnSelect={false}>
            <CreateShopDialog />
          </MenuItem>

          {/* Davetlerim (only visible if pending invitations exist) */}
          <InvitationsMenuItem />

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
