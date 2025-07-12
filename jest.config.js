// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    // Use babel-jest to transform .js and .jsx files
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  // polyfill window.matchMedia before tests
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"]
};
