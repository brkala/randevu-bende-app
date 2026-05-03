import { fakerTR } from '@faker-js/faker';
import { Builder } from 'builder-pattern';
import type { TodoType } from '../../schemas/todo.schema';

fakerTR.seed(1234);

export const createTodoBuilder = () => {
  return Builder<TodoType>()
    .id(fakerTR.string.uuid())
    .title(fakerTR.book.title())
    .text(fakerTR.lorem.paragraphs(2))
    .date(fakerTR.date.future())
    .createdAt(new Date())
    .updatedAt(new Date());
};
