import type { ComponentProps } from 'react';
import { useFieldContext } from '@/features/form/form.context';
import { PinInputRoot } from '@/features/shared/components/ui/pin-input';

interface PinInputFieldProps extends ComponentProps<typeof PinInputRoot> {
  count: number;
}

function padValue(value: string, count: number): string[] {
  const chars = value ? value.split('') : [];
  const padded = new Array(count).fill('');
  for (let i = 0; i < Math.min(chars.length, count); i++) {
    padded[i] = chars[i];
  }
  return padded;
}

export function PinInputField({ label, count, ...props }: PinInputFieldProps) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.errors.length > 0;
  const firstError = field.state.meta.errors[0];
  const errorText =
    typeof firstError === 'string' ? firstError : (firstError as { message?: string })?.message;

  return (
    <PinInputRoot
      {...props}
      label={label}
      count={count}
      type="numeric"
      value={padValue(field.state.value, count)}
      onValueChange={(details) => field.handleChange(details.valueAsString)}
      onValueComplete={() => field.handleBlur()}
      onRootBlur={() => field.handleBlur()}
      state={hasError ? 'error' : undefined}
      errorText={hasError ? errorText : undefined}
    />
  );
}
