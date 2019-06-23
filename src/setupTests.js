// @testing-library/react renders your components to document.body,
// this will ensure they're removed after each test.
import "@testing-library/react/cleanup-after-each";

// this adds jest-dom's custom assertions
import "jest-dom/extend-expect";

// window.indexedDB is not available when running in headless mode using Jest,
// stub in a pure JS in-memory implementation of the IndexedDB API for testing
import "fake-indexeddb/auto";

// HACK: silence broken test warnings
// ReactDOM will warn that tests are not wrapped in act() whenever a component
// updates its state via an async callback
// Known issue: https://github.com/testing-library/react-testing-library/issues/281
// React v16.9.0 will add support for async act() fixing the issue
// TODO: remove hack when v16.9 is released
const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
