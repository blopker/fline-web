import React from "react";
import { render, waitForDomChange } from "@testing-library/react";
import App from "./App";
import { db } from "./db";

it("renders without crashing", async () => {
  render(<App db={db} />);
  await waitForDomChange();
});
