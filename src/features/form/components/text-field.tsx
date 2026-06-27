import { useFieldContext } from '@/features/form/form.context';
import {
  FieldErrorText,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from '@/features/shared/components/ui/field';

interface TextFieldProps {
  label: string;
  placeholder?: string;
  'data-testid'?: string;
}

export function TextField({ label, placeholder, ...rest }: TextFieldProps) {
  const field = useFieldContext<string>();
  const testId = rest['data-testid'];

  return (
    <FieldRoot invalid={field.state.meta.errors.length > 0}>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        state={field.state.meta.errors.length > 0 ? 'error' : 'default'}
        data-testid={testId}
      />
      {field.state.meta.errors.map((error) => (
        <FieldErrorText key={error?.toString()}>{error}</FieldErrorText>
      ))}
    </FieldRoot>
  );
}
