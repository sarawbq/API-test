/** @type {import('jest').Config} */
const config = {
  verbose: true,
  workerThreads: false,
  collectCoverage: false,
  testRegex: "((\\.|/*.)(test))\\.(js)?$",
  moduleFileExtensions: ["js"],
};

module.exports = config;


