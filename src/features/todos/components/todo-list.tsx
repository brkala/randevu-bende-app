import type { Todo } from '@prisma/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { todoQueries } from '../todos.queries';
import { TodoForm } from './todo-form';
import { TodoItemComponent } from './todo-item';

export const TodoList = () => {
  const { data: todos } = useSuspenseQuery(todoQueries.all());

  return (
    <div
      style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc' }}
    >
      <h1>Todo List</h1>
      <TodoForm />
      <div>
        {todos.map((todo: Todo) => (
          <TodoItemComponent key={todo.id} todo={todo} />
        ))}
        {todos.length === 0 && <p>No todos yet. Add one above!</p>}
      </div>
    </div>
  );
};
