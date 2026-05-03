import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Başlık boş olamaz'),
  text: z.string().min(1, 'Yazı boş olamaz'),
  date: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TodoType = z.infer<typeof todoSchema>;
