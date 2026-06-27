import { useFieldContext } from '@/features/form/form.context';
import { PasswordInput } from '@/features/shared/components/ui/password-input';

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
}

export function PasswordField({ label, placeholder }: PasswordFieldProps) {
  const field = useFieldContext<string>();

  return (
    <PasswordInput
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      state={field.state.meta.errors.length > 0 ? 'error' : 'default'}
      errorText={field.state.meta.errors[0]?.toString()}
    />
  );
}
