import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import initDB from "./db";
import App from "./App";

let container;
let db;

beforeEach(() => {
  db = initDB();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it("renders without crashing", () => {
  act(() => {
    // Complains about not being in 'act' function.
    // Known issue: https://github.com/testing-library/react-testing-library/issues/281
    // Maybe fixed in reactdom 16.9
    ReactDOM.render(<App db={db} />, container);
  });
});
