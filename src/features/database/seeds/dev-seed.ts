import { prisma } from '../lib/client';
import { todoSchema } from '../schemas/todo.schema';
import { createTodoBuilder } from './builders/todo.builder';

export async function seedDevelopmentData(_coreData: object) {
  console.log('🛠 [Dev] Geliştirici (Dev) mock verileri ekleniyor...');

  console.log('📝 Todolar oluşturuluyor...');

  for (let i = 0; i < 5; i++) {
    const mockTodoObj = createTodoBuilder().build();
    const validTodo = todoSchema.parse(mockTodoObj);

    const todo = await prisma.todo.create({
      data: validTodo,
    });

    console.log(`✅ Todo eklendi: ${todo.title}`);
  }
}
