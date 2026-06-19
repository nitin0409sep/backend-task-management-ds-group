import { taskQuerySchema } from './task.validation.js';

describe('taskQuerySchema', () => {
  it('treats blank filter values as unset', () => {
    const result = taskQuerySchema.parse({ search: '', status: '', priority: '', sortBy: '', sortOrder: '' });

    expect(result).toEqual({
      search: undefined,
      status: undefined,
      priority: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  });

  it('accepts createdAt as an explicit sort field', () => {
    const result = taskQuerySchema.parse({ sortBy: 'createdAt', sortOrder: 'desc' });

    expect(result.sortBy).toBe('createdAt');
    expect(result.sortOrder).toBe('desc');
  });

  it('rejects unsupported sort fields', () => {
    expect(taskQuerySchema.safeParse({ sortBy: 'assignee' }).success).toBe(false);
  });
});
