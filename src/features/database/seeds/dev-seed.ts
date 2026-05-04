import { prisma } from '../lib/client.server';
import { todoSchema } from '../schemas/todo.schema';
import { createTodoBuilder } from './builders/todo.builder';

export async function seedDevelopmentData(_coreData: object) {
  console.log('🛠 [Dev] Geliştirici (Dev) mock verileri ekleniyor...');
  console.log('📝 Todolar oluşturuluyor...');

  const todosData = Array.from({ length: 5 }).map(() => {
    const mockTodoObj = createTodoBuilder().build();
    return todoSchema.parse(mockTodoObj);
  });

  await prisma.todo.createMany({
    data: todosData,
  });

  console.log(`✅ ${todosData.length} adet Todo başarıyla oluşturuldu.`);
}
