module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".spec.ts$",
  testTimeout: 15000,
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};
