import React from "react";
import { render, waitForDomChange } from "@testing-library/react";
import App from "./App";
import { db } from "./db";

it("renders without crashing", async () => {
  const mock_fb = {
    auth: {
      currentUser: { name: "testUser", email: "test@test.com" },
      onAuthStateChanged: () => () => {}
    }
  };
  render(<App db={db} fb={mock_fb} />);
  await waitForDomChange();
});
