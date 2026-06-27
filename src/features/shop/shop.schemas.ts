import { z } from 'zod';

// --- Shop ---

export const CreateShopSchema = z.object({
  title: z
    .string()
    .min(1, 'Dükkan adı zorunludur')
    .max(100, 'Dükkan adı en fazla 100 karakter olabilir'),
});

export type CreateShopInput = z.infer<typeof CreateShopSchema>;

// --- Invitation ---

export const InviteEmployeeSchema = z.object({
  shopId: z.string().min(1),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz').max(15),
});

export type InviteEmployeeInput = z.infer<typeof InviteEmployeeSchema>;

export const AcceptInvitationSchema = z.object({
  invitationId: z.string().min(1),
  displayName: z
    .string()
    .min(1, 'Görünür isim zorunludur')
    .max(100, 'Görünür isim en fazla 100 karakter olabilir'),
});

export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;

export const RejectInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export type RejectInvitationInput = z.infer<typeof RejectInvitationSchema>;

// --- Employee Removal ---

export const RemoveEmployeeSchema = z.object({
  shopId: z.string().min(1),
  memberId: z.string().min(1),
});

export type RemoveEmployeeInput = z.infer<typeof RemoveEmployeeSchema>;

// --- Query params ---

export const ShopIdParamSchema = z.object({
  shopId: z.string().min(1),
});

export type ShopIdParam = z.infer<typeof ShopIdParamSchema>;
