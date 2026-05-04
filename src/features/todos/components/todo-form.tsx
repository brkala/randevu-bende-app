import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createTodoFn } from '../todos.functions';

export const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { title: string; text: string; date: Date }) => createTodoFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
      setText('');
    },
  });

  const handleAdd = () => {
    if (!title.trim()) return;

    mutation.mutate({ title, text, date: new Date(date) });
  };

  return (
    <div
      style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      data-testid="todo-form-container"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo Title"
        disabled={mutation.isPending}
        data-testid="todo-title-input"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Todo Content/Text"
        disabled={mutation.isPending}
        data-testid="todo-text-input"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={mutation.isPending}
        data-testid="todo-date-input"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={mutation.isPending}
        data-testid="todo-add-button"
      >
        {mutation.isPending ? 'Adding...' : 'Add Todo'}
      </button>
    </div>
  );
};
