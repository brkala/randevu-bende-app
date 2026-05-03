import { queryOptions } from '@tanstack/react-query';
import { getTodosFn } from './todos.functions';

export const todoQueries = {
  all: () =>
    queryOptions({
      queryKey: ['todos'],
      queryFn: () => getTodosFn(),
    }),
};
