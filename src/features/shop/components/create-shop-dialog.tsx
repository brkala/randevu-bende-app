import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Store } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/features/shared/components/ui/button';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';
import { Field } from '@/features/shared/components/ui/field';
import { createShopFn } from '@/features/shop/shop.functions';

export function CreateShopDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createShopFn,
    onSuccess: (result) => {
      setOpen(false);
      setTitle('');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.navigate({
        to: '/shops/$shopId',
        params: { shopId: result.organizationId },
      });
    },
    onError: (err) => {
      // Error is shown via <p> below — dialog stays open
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ data: { title: title.trim() } });
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-l1 hover:bg-bg-hover cursor-pointer"
        >
          <Store size={16} />
          Dükkan Oluştur
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Dükkan Oluştur</DialogTitle>
        <DialogDescription>Yeni dükkanınız için bir isim girin.</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Field label="Dükkan Adı" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Berber Ali Usta"
              className="w-full h-control-h px-3 text-control bg-bg-default border border-border-default rounded-l2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent"
              data-testid="shop-create-name-input"
            />
          </Field>
          {mutation.isError ? (
            <p className="text-sm text-error-default">
              {mutation.error instanceof Error ? mutation.error.message : 'Dükkan oluşturulamadı'}
            </p>
          ) : null}
          <div className="flex gap-3 justify-end">
            <DialogCloseTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                İptal
              </Button>
            </DialogCloseTrigger>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={!title.trim() || mutation.isPending}
              data-testid="shop-create-submit"
            >
              {mutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
