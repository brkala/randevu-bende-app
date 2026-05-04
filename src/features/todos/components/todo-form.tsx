import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createTodoFn, getTodoImageUploadUrlFn } from '../todos.functions';

export const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { title: string; text: string; date: Date; file?: File | null }) => {
      let imageKey: string | undefined;

      if (data.file) {
        if (data.file.size > 5 * 1024 * 1024) {
          throw new Error("Dosya boyutu 5MB'dan büyük olamaz.");
        }

        if (!data.file.type.startsWith('image/')) {
          throw new Error('Sadece resim dosyaları yüklenebilir.');
        }

        const fileKey = `temp/todos/${Date.now()}-${data.file.name}`;

        const uploadUrl = await getTodoImageUploadUrlFn({
          data: {
            fileKey,
            contentType: data.file.type,
            fileSize: data.file.size,
          },
        });

        await fetch(uploadUrl, {
          method: 'PUT',
          body: data.file,
          headers: { 'Content-Type': data.file.type },
        });

        imageKey = fileKey;
      }

      return createTodoFn({
        data: { title: data.title, text: data.text, date: data.date, image: imageKey },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
      setText('');
      setFile(null);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleAdd = () => {
    if (!title.trim()) return;
    mutation.mutate({ title, text, date: new Date(date), file });
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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={mutation.isPending}
        data-testid="todo-image-input"
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
