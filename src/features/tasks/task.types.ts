export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilters = {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: 'priority' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};
