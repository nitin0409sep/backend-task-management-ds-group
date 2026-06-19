module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\.ts$': ['ts-jest', { useESM: true, diagnostics: { ignoreCodes: [151002] } }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
};
