import { prisma } from '@/features/database/lib/client.server';
import { deleteFile, finalizeFile } from '../storage/storage.server';
import type { CreateTodoInput, DeleteTodoInput, UpdateTodoInput } from './todos.schemas';

export const getTodos = async () => {
  return await prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createTodo = async (input: CreateTodoInput) => {
  let finalImageKey = input.image;

  if (finalImageKey) {
    finalImageKey = await finalizeFile(finalImageKey);
  }

  return await prisma.todo.create({
    data: {
      title: input.title,
      text: input.text,
      date: input.date,
      image: finalImageKey,
    },
  });
};

export const updateTodo = async (input: UpdateTodoInput) => {
  const { id, ...data } = input;
  return await prisma.todo.update({
    where: { id },
    data,
  });
};

export const deleteTodo = async (input: DeleteTodoInput) => {
  const todo = await prisma.todo.findUnique({
    where: { id: input.id },
    select: { image: true },
  });

  if (todo?.image) {
    await deleteFile(todo.image);
  }

  return await prisma.todo.delete({
    where: { id: input.id },
  });
};
