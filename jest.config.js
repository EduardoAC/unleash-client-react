module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$",
  ],
  automock: false,
  setupFiles: ["./setupJest.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
