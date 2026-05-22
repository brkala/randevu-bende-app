import { fakerTR } from '@faker-js/faker';
import { Builder } from 'builder-pattern';
import { v7 as uuidv7 } from 'uuid';
import type { TodoType } from '../../schemas/todo.schema';

fakerTR.seed(1234);

const SEED_IMAGES = [
  'seed/avatars/avatar-1.png',
  'seed/avatars/avatar-2.png',
  'seed/avatars/avatar-3.png',
  'seed/logos/logo-1.png',
  'seed/logos/logo-2.png',
  'seed/logos/logo-3.png',
];

export const createTodoBuilder = () => {
  return Builder<TodoType>()
    .id(uuidv7())
    .title(fakerTR.book.title())
    .text(fakerTR.lorem.paragraphs(2))
    .date(fakerTR.date.future())
    .image(fakerTR.helpers.arrayElement(SEED_IMAGES))
    .createdAt(new Date())
    .updatedAt(new Date());
};
