import { z } from 'zod';

const onlyDigits = /^\d*$/;

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Telefon numarası zorunludur')
    .regex(onlyDigits, 'Sadece rakam girebilirsiniz')
    .length(10, 'Telefon numarası 10 haneli olmalıdır'),
  code: z
    .string()
    .refine(
      (v) => v === '' || (v.length === 6 && onlyDigits.test(v)),
      'Onay kodu 6 haneli olmalıdır',
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
