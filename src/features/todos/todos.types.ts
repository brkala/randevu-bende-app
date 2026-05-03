import type { Todo } from '@prisma/client';

export type TodoItem = Todo;

export interface TodoFeatureState {
  isEditing: boolean;
  editingId: string | null;
}
