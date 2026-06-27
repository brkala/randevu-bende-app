import { useFieldContext } from '@/features/form/form.context';
import { CheckboxField as UICheckbox } from '@/features/shared/components/ui/checkbox';

interface FormCheckboxProps {
  label: string;
}

export function FormCheckbox({ label }: FormCheckboxProps) {
  const field = useFieldContext<boolean>();

  return (
    <UICheckbox
      label={label}
      checked={field.state.value}
      onCheckedChange={({ checked }) => field.handleChange(checked === true)}
    />
  );
}
