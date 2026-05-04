import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTodoFn } from '../todos.functions';
import type { TodoItem } from '../todos.types';

interface Props {
  todo: TodoItem;
}

export const TodoItemComponent = ({ todo }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (data: { id: string }) => deleteTodoFn({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #eee' }} data-testid="todo-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <strong style={{ display: 'block' }} data-testid="todo-item-title">
            {todo.title}
          </strong>
          <p style={{ margin: '5px 0', color: '#666' }} data-testid="todo-item-text">
            {todo.text}
          </p>
          <small style={{ color: '#999' }}>Date: {new Date(todo.date).toLocaleDateString()}</small>
        </div>
        <button
          type="button"
          onClick={() => deleteMutation.mutate({ id: todo.id })}
          disabled={deleteMutation.isPending}
          data-testid="todo-delete-button"
        >
          {deleteMutation.isPending ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
