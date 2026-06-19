import { getPagination } from '../utils/pagination.js';

describe('getPagination', () => {
  it('normalizes page and limit', () => {
    expect(getPagination(2, 20)).toEqual({ page: 2, limit: 20, offset: 20 });
  });

  it('keeps values within safe limits', () => {
    expect(getPagination(-1, 200)).toEqual({ page: 1, limit: 50, offset: 0 });
  });
});
