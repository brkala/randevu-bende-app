import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
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
import { PinInputRoot } from '@/features/shared/components/ui/pin-input';
import { inviteEmployeeFn } from '@/features/shop/shop.functions';
import { shopKeys } from '@/features/shop/shop.queries';

interface InviteEmployeeDialogProps {
  shopId: string;
}

export function InviteEmployeeDialog({ shopId }: InviteEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: inviteEmployeeFn,
    onSuccess: () => {
      setOpen(false);
      setPhone('');
      setError(null);
      queryClient.invalidateQueries({ queryKey: shopKeys.employeeList(shopId) });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Davet gönderilemedi');
    },
  });

  const handleInvite = () => {
    if (phone.length < 10) {
      setError('Geçerli bir telefon numarası giriniz');
      return;
    }
    setError(null);
    mutation.mutate({ data: { shopId, phone } });
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="accent" size="sm" data-testid="invite-employee-button">
          <UserPlus size={16} />
          Çalışan Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Çalışan Davet Et</DialogTitle>
        <DialogDescription>
          Davet etmek istediğiniz kişinin telefon numarasını girin.
        </DialogDescription>
        <div className="space-y-4 mt-4">
          <PinInputRoot
            label="Telefon Numarası"
            count={10}
            size="md"
            state={error ? 'error' : undefined}
            errorText={error ?? undefined}
            onValueComplete={(e) => setPhone(e.valueAsString)}
            data-testid="invite-phone-pin-input"
          />
          <div className="flex gap-3 justify-end">
            <DialogCloseTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                İptal
              </Button>
            </DialogCloseTrigger>
            <Button
              variant="accent"
              size="sm"
              disabled={phone.length < 10 || mutation.isPending}
              onClick={handleInvite}
              data-testid="invite-submit"
            >
              {mutation.isPending ? 'Gönderiliyor...' : 'Davet Gönder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
