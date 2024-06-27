module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}', '<rootDir>/src/*'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src/$1',
    '^configs(.*)$': '<rootDir>/src/configs/$1',
    '^store(.*)$': '<rootDir>/src/store/$1',
    '^auth(.*)$': '<rootDir>/src/auth/$1',
    '^test-utilts(.*)$': '<rootDir>/src/test-utilts/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^.+\\.svg$': 'jest-svg-transformer'
  },
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/jestEnv.js'],
  moduleDirectories: ['node_modules', 'src']
};
