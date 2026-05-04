import { prisma } from '@/features/database/lib/client.server';
import type { CreateTodoInput, DeleteTodoInput, UpdateTodoInput } from './todos.schemas';

export const getTodos = async () => {
  return await prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createTodo = async (input: CreateTodoInput) => {
  return await prisma.todo.create({
    data: {
      title: input.title,
      text: input.text,
      date: input.date,
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
  return await prisma.todo.delete({
    where: { id: input.id },
  });
};
