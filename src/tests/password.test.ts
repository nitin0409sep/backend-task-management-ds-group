import { hashPassword, verifyPassword } from '../utils/password.js';

describe('password helpers', () => {
  it('verifies a hashed password', async () => {
    const hash = await hashPassword('Password@123');
    await expect(verifyPassword('Password@123', hash)).resolves.toBe(true);
  });
});
