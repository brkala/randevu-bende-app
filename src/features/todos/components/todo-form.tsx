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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ title, text, date: new Date(date) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo Title"
        disabled={mutation.isPending}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Todo Content/Text"
        disabled={mutation.isPending}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={mutation.isPending}
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
};
