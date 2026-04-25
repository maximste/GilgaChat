/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.hbs\\?raw$": "<rootDir>/test/mocks/stringDefaultExport.ts",
    "\\.(scss|sass|css)$": "<rootDir>/test/mocks/styleMock.ts",
  },
};
