import { z } from 'zod';

export const todoIdSchema = z.string().uuid();

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  text: z.string().max(500),
  date: z.coerce.date(),
  image: z.string().optional(),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  id: todoIdSchema,
});

export const deleteTodoSchema = z.object({
  id: todoIdSchema,
});

export const todoImageUploadSchema = z.object({
  fileKey: z.string(),
  contentType: z.string().refine((val) => val.startsWith('image/'), {
    message: 'Sadece resim dosyaları yüklenebilir.',
  }),
  fileSize: z.number().max(5 * 1024 * 1024, {
    message: "Dosya boyutu 5MB'dan büyük olamaz.",
  }),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
export type TodoImageUploadInput = z.infer<typeof todoImageUploadSchema>;
