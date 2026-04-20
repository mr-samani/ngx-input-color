import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/src/test.ts', '/src/environments/'],
  coverageProvider: 'v8',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: './projects/library/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'html'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^src/(.*)$': './projects/library/src/$1',
  },
};

export default config;