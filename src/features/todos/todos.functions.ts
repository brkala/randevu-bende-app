import { createServerFn } from '@tanstack/react-start';
import { createTodoSchema, deleteTodoSchema, updateTodoSchema } from './todos.schemas';

export const getTodosFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { getTodos } = await import('./todos.server');
  return await getTodos();
});

export const createTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createTodoSchema.parse(data))
  .handler(async ({ data }) => {
    const { createTodo } = await import('./todos.server');
    return await createTodo(data);
  });

export const updateTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateTodoSchema.parse(data))
  .handler(async ({ data }) => {
    const { updateTodo } = await import('./todos.server');
    return await updateTodo(data);
  });

export const deleteTodoFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteTodoSchema.parse(data))
  .handler(async ({ data }) => {
    const { deleteTodo } = await import('./todos.server');
    return await deleteTodo(data);
  });
