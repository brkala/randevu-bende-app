import { createFormHook } from '@tanstack/react-form';
import { FormCheckbox } from '@/features/form/components/checkbox-field';
import { PasswordField } from '@/features/form/components/password-field';
import { PinInputField } from '@/features/form/components/pin-input-field';
import { SubmitButton } from '@/features/form/components/submit-button';
import { TextField } from '@/features/form/components/text-field';
import { fieldContext, formContext } from '@/features/form/form.context';

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    FormCheckbox,
    PinInputField,
  },
  formComponents: {
    SubmitButton,
  },
});
