import { useFormContext } from '@/features/form/form.context';
import { Button } from '@/features/shared/components/ui/button';

interface SubmitButtonProps {
  label: string;
}

export function SubmitButton({ label }: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => {
        const text = isSubmitting ? 'Yükleniyor...' : label;
        return (
          <Button
            type="submit"
            variant="accent"
            size="md"
            disabled={isSubmitting}
            className="w-full"
          >
            {text}
          </Button>
        );
      }}
    </form.Subscribe>
  );
}
