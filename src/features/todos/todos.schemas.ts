import { z } from 'zod';

export const todoIdSchema = z.string().uuid();

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  text: z.string().max(500),
  date: z.coerce.date(),
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  id: todoIdSchema,
});

export const deleteTodoSchema = z.object({
  id: todoIdSchema,
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
