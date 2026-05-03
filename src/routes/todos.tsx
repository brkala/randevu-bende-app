import { createFileRoute } from '@tanstack/react-router';
import { TodoList } from '@/features/todos/components/todo-list';
import { todoQueries } from '@/features/todos/todos.queries';

export const Route = createFileRoute('/todos')({
  component: TodoList,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(todoQueries.all());
  },
});
