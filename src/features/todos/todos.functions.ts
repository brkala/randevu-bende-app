import { createServerFn } from '@tanstack/react-start';
import { getPresignedUploadUrl } from '../storage/storage.server';
import {
  createTodoSchema,
  deleteTodoSchema,
  todoImageUploadSchema,
  updateTodoSchema,
} from './todos.schemas';
import { createTodo, deleteTodo, getTodos, updateTodo } from './todos.server';

export const getTodoImageUploadUrlFn = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => todoImageUploadSchema.parse(data))
  .handler(async ({ data }) => {
    return await getPresignedUploadUrl(data.fileKey, data.contentType, data.fileSize);
  });

export const getTodosFn = createServerFn({ method: 'GET' }).handler(async () => {
  return await getTodos();
});

export const createTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createTodoSchema.parse(data))
  .handler(async ({ data }) => {
    return await createTodo(data);
  });

export const updateTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateTodoSchema.parse(data))
  .handler(async ({ data }) => {
    return await updateTodo(data);
  });

export const deleteTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteTodoSchema.parse(data))
  .handler(async ({ data }) => {
    return await deleteTodo(data);
  });
