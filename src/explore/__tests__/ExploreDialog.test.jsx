import React from "react";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  waitForDomChange
} from "react-testing-library";
import ExploreDialog from "../ExploreDialog";
import { db } from "../../db";
import Theme from "../../Theme";
import { DatabaseProvider } from "../../databaseContext";
import { MemoryRouter, Route } from "react-router-dom";

jest.mock("../../ResponsiveWrapper");
jest.mock("../AnimatedLinePath");

jest.mock("@material-ui/core/Dialog", () => ({ children }) => children);

// Wipe the DB across tests
beforeEach(async () => {
  await Promise.all([db.logEntries.clear(), db.bloodGlucoseLevels.clear()]);
});

afterAll(async () => {
  await Promise.all([db.logEntries.clear(), db.bloodGlucoseLevels.clear()]);
});

const AllTheProviders = ({ children }) => (
  <Theme>
    <DatabaseProvider db={db}>
      <MemoryRouter initialEntries={["/log/explore"]}>{children}</MemoryRouter>
    </DatabaseProvider>
  </Theme>
);

// Re-usable helper function for setting up data providers between test cases
const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("ExploreDialog", () => {
  test("Shows empty state when DB is empty", async () => {
    expect.assertions(1);
    const { getByText, getByLabelText } = renderWithProviders(
      <ExploreDialog isOpen={true} onClose={() => {}} />
    );

    await waitForElementToBeRemoved(() => getByLabelText("loading"));
    expect(getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  test("Shows empty state if entries exist but are not tagged", async () => {
    expect.assertions(1);
    await db.logEntries.add({
      date: new Date(),
      description: "Hot Dog",
      tags: []
    });
    const { getByText, getByLabelText } = renderWithProviders(
      <ExploreDialog isOpen={true} onClose={() => {}} />
    );

    await waitForElementToBeRemoved(() => getByLabelText("loading"));
    expect(getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  test("Shows tags where entries exist for that tag", async () => {
    expect.assertions(8);
    await db.logEntries.bulkAdd([
      {
        date: new Date(),
        description: "Frosted Flakes",
        tags: ["breakfast"]
      },
      {
        date: new Date(),
        description: "Hot Dog",
        tags: ["meal"]
      },
      {
        date: new Date(),
        description: "Beer",
        tags: ["alcohol"]
      }
    ]);
    const { getByLabelText, queryByLabelText } = renderWithProviders(
      <ExploreDialog isOpen={true} onClose={() => {}} />
    );

    await waitForElementToBeRemoved(() => getByLabelText("loading"));
    expect(getByLabelText(/breakfast/i)).toBeInTheDocument();
    expect(getByLabelText(/meal/i)).toBeInTheDocument();
    expect(getByLabelText(/alcohol/i)).toBeInTheDocument();

    expect(queryByLabelText(/snack/i)).not.toBeInTheDocument();
    expect(queryByLabelText(/beverage/i)).not.toBeInTheDocument();
    expect(queryByLabelText(/exercise/i)).not.toBeInTheDocument();
    expect(queryByLabelText(/feeling/i)).not.toBeInTheDocument();
    expect(queryByLabelText(/other/i)).not.toBeInTheDocument();
  });

  test("Shows entries that match tag", async () => {
    expect.assertions(4);
    await db.logEntries.bulkAdd([
      {
        date: new Date(),
        description: "Frosted Flakes",
        tags: ["breakfast"]
      },
      {
        date: new Date(),
        description: "Hot Dog",
        tags: ["meal"]
      }
    ]);
    const {
      getByLabelText,
      getByText,
      findByText,
      queryByLabelText
    } = renderWithProviders(<ExploreDialog isOpen={true} onClose={() => {}} />);

    await waitForElementToBeRemoved(() => getByLabelText("loading"));
    fireEvent.click(getByLabelText(/breakfast/i));
    expect(getByText(/Frosted Flakes/i)).toBeInTheDocument();
    expect(queryByLabelText(/Hot Dog/i)).not.toBeInTheDocument();

    fireEvent.click(getByLabelText(/meal/i));
    expect(await findByText(/Hot Dog/i)).toBeInTheDocument();
    expect(queryByLabelText(/Frosted Flakes/i)).not.toBeInTheDocument();
  });

  test("Groups entries with data and without data", async () => {
    expect.assertions(2);
    await db.logEntries.bulkAdd([
      {
        date: new Date("2019-07-04T12:00"),
        description: "hot dog",
        tags: ["meal"]
      },
      {
        date: new Date("2019-01-01T08:00"),
        description: "pizza",
        tags: ["meal"]
      }
    ]);
    await db.bloodGlucoseLevels.bulkAdd([
      {
        date: new Date("2019-07-04T11:00"),
        level: 100
      },
      {
        date: new Date("2019-07-04T12:00"),
        level: 120
      },
      {
        date: new Date("2019-07-04T13:00"),
        level: 150
      },
      {
        date: new Date("2019-07-04T14:00"),
        level: 170
      },
      {
        date: new Date("2019-07-04T15:00"),
        level: 160
      }
    ]);
    const { getByLabelText, getByTestId } = renderWithProviders(
      <ExploreDialog isOpen={true} onClose={() => {}} />
    );

    await waitForElementToBeRemoved(() => getByLabelText("loading"));
    expect(getByTestId("entriesWithData")).toHaveTextContent(/hot dog/i);
    expect(getByTestId("entriesWithoutData")).toHaveTextContent(/pizza/i);
  });

  test("Checking an entry draws a line path", async () => {
    expect.assertions(25);
    await db.logEntries.bulkAdd([
      {
        id: 100,
        date: new Date("2019-07-04T12:00"),
        description: "hot dog",
        tags: ["meal"]
      },
      {
        id: 200,
        date: new Date("2019-11-28T12:00"),
        description: "turkey",
        tags: ["meal"]
      }
    ]);
    await db.bloodGlucoseLevels.bulkAdd([
      {
        date: new Date("2019-07-04T11:00"),
        level: 100
      },
      {
        date: new Date("2019-07-04T12:00"),
        level: 120
      },
      {
        date: new Date("2019-07-04T13:00"),
        level: 150
      },
      {
        date: new Date("2019-07-04T14:00"),
        level: 170
      },
      {
        date: new Date("2019-07-04T15:00"),
        level: 160
      },
      {
        date: new Date("2019-11-28T11:00"),
        level: 140
      },
      {
        date: new Date("2019-11-28T12:00"),
        level: 170
      },
      {
        date: new Date("2019-11-28T13:00"),
        level: 190
      },
      {
        date: new Date("2019-11-28T14:00"),
        level: 200
      },
      {
        date: new Date("2019-11-28T15:00"),
        level: 180
      }
    ]);
    const {
      getByLabelText,
      getByTestId,
      getByText,
      queryByTestId
    } = renderWithProviders(<ExploreDialog isOpen={true} onClose={() => {}} />);

    await waitForElementToBeRemoved(() => getByLabelText("loading"));

    const graph = getByTestId("comparisonGraph");
    const hotDogInput = getByText(/hot dog/i)
      .closest("li")
      .querySelector("input");
    const turkeyInput = getByText(/turkey/i)
      .closest("li")
      .querySelector("input");

    // The first element should be auto checked
    expect(hotDogInput.checked).toBe(true);
    expect(turkeyInput.checked).toBe(false);
    expect(graph.querySelectorAll("path")).toHaveLength(1);
    expect(getByTestId("path-100")).toBeInTheDocument();
    expect(queryByTestId("path-200")).not.toBeInTheDocument();

    fireEvent.click(turkeyInput);
    expect(hotDogInput.checked).toBe(true);
    expect(turkeyInput.checked).toBe(true);
    expect(graph.querySelectorAll("path")).toHaveLength(2);
    expect(getByTestId("path-100")).toBeInTheDocument();
    expect(getByTestId("path-200")).toBeInTheDocument();

    fireEvent.click(hotDogInput);
    expect(hotDogInput.checked).toBe(false);
    expect(turkeyInput.checked).toBe(true);
    expect(graph.querySelectorAll("path")).toHaveLength(1);
    expect(queryByTestId("path-100")).not.toBeInTheDocument();
    expect(getByTestId("path-200")).toBeInTheDocument();

    fireEvent.click(turkeyInput);
    expect(hotDogInput.checked).toBe(false);
    expect(turkeyInput.checked).toBe(false);
    expect(graph.querySelectorAll("path")).toHaveLength(0);
    expect(queryByTestId("path-100")).not.toBeInTheDocument();
    expect(queryByTestId("path-200")).not.toBeInTheDocument();

    fireEvent.click(hotDogInput);
    expect(hotDogInput.checked).toBe(true);
    expect(turkeyInput.checked).toBe(false);
    expect(graph.querySelectorAll("path")).toHaveLength(1);
    expect(getByTestId("path-100")).toBeInTheDocument();
    expect(queryByTestId("path-200")).not.toBeInTheDocument();
  });

  test("Highlighting an entry highlights a path", async () => {
    expect.assertions(4);
    await db.logEntries.bulkAdd([
      {
        id: 100,
        date: new Date("2019-07-04T12:00"),
        description: "hot dog",
        tags: ["meal"]
      }
    ]);
    await db.bloodGlucoseLevels.bulkAdd([
      {
        date: new Date("2019-07-04T11:00"),
        level: 100
      },
      {
        date: new Date("2019-07-04T12:00"),
        level: 120
      },
      {
        date: new Date("2019-07-04T13:00"),
        level: 150
      },
      {
        date: new Date("2019-07-04T14:00"),
        level: 170
      },
      {
        date: new Date("2019-07-04T15:00"),
        level: 160
      }
    ]);
    const { getByLabelText, getByTestId, getByText } = renderWithProviders(
      <ExploreDialog isOpen={true} onClose={() => {}} />
    );

    await waitForElementToBeRemoved(() => getByLabelText("loading"));
    const hotDogLine = getByTestId("path-100");
    const hotDogText = getByText(/hot dog/i);
    expect(hotDogLine).toBeInTheDocument();
    expect(hotDogLine).not.toHaveAttribute("stroke", "#ff9800");
    fireEvent.click(hotDogText);
    expect(hotDogLine).toHaveAttribute("stroke", "#ff9800");
    fireEvent.click(hotDogText);
    expect(hotDogLine).not.toHaveAttribute("stroke", "#ff9800");
  });
});
