import React from "react";
import {
  render,
  fireEvent,
  wait,
  waitForElementToBeRemoved
} from "react-testing-library";
import LogScreen from "../LogScreen";
import { db } from "../../db";
import Theme from "../../Theme";
import { DatabaseProvider } from "../../databaseContext";
import { MemoryRouter, Route } from "react-router-dom";

// Wipe the DB across tests
beforeEach(async () => {
  await db.logEntries.clear();
});

afterAll(async () => {
  await db.logEntries.clear();
});

const AllTheProviders = ({ children }) => (
  <Theme>
    <DatabaseProvider db={db}>
      <MemoryRouter initialEntries={["/log"]}>{children}</MemoryRouter>
    </DatabaseProvider>
  </Theme>
);

// Re-usable helper function for setting up data providers between test cases
const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("LogScreen", () => {
  test("shows an intro message if the log is empty", async () => {
    const { findByText } = renderWithProviders(
      <LogScreen
        menu={<div />}
        date={new Date()}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    await findByText(/log what happened today/i);
  });

  test("hides the intro message when the log is not empty", async () => {
    await db.logEntries.add({
      date: new Date("2019-07-04T12:00"),
      description: "4th of July Hot Dog"
    });
    const { getByText, queryByText } = renderWithProviders(
      <LogScreen
        menu={<div />}
        date={new Date("2019-07-04T00:00")}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    expect(queryByText(/log what happened today/i)).not.toBeInTheDocument();
  });

  test("shows the import banner when the log is not empty", async () => {
    await db.logEntries.add({
      date: new Date("2019-07-04T12:00"),
      description: "4th of July Hot Dog"
    });
    const { getByText } = renderWithProviders(
      <LogScreen
        menu={<div />}
        date={new Date("2019-07-04T00:00")}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    expect(getByText(/add your glucose data/)).toBeInTheDocument();
  });

  test("hides the import banner when the log is empty", async () => {
    const { getByText, queryByText } = renderWithProviders(
      <LogScreen
        menu={<div />}
        date={new Date()}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    expect(queryByText(/add your glucose data/)).not.toBeInTheDocument();
  });

  test("renders matching entries for a given date", async () => {
    // Add fixture data
    await db.logEntries.bulkAdd([
      {
        date: new Date("2019-07-04T12:00"),
        description: "4th of July Hot Dog"
      },
      {
        date: new Date("2019-07-04T14:00"),
        description: "4th of July Cheeseburger"
      },
      {
        date: new Date("2019-10-31T21:15"),
        description: "Halloween Candy Corn"
      },
      {
        date: new Date("2019-10-31T23:00"),
        description: "Halloween Caramel Apple"
      },
      {
        date: new Date("2019-11-28T18:00"),
        description: "Thanksgiving Turkey"
      },
      {
        date: new Date("2019-11-28T19:30"),
        description: "Thanksgiving Stuffing"
      }
    ]);

    // Render the log screen for the 4th of July
    const fourthOfJuly = new Date("2019-07-04T00:00");
    const {
      getByText,
      getAllByText,
      findAllByText,
      queryByText,
      rerender
    } = renderWithProviders(
      <LogScreen
        menu={<div />}
        date={fourthOfJuly}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    // Check that both "4th of July" entries are contained in the log
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    expect(getAllByText(/4th of July/i)).toHaveLength(2);
    expect(queryByText(/Halloween/i)).not.toBeInTheDocument();
    expect(queryByText(/Thanksgiving/i)).not.toBeInTheDocument();

    // Switch the log screen to Halloween
    const halloween = new Date("2019-10-31T00:00");
    rerender(
      <LogScreen
        menu={<div />}
        date={halloween}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    //Check that there are now two "Halloween" entries
    expect(await findAllByText(/Halloween/i)).toHaveLength(2);
    expect(queryByText(/4th of July/i)).not.toBeInTheDocument();
    expect(queryByText(/Thanksgiving/i)).not.toBeInTheDocument();

    // Finally, switch to Thanksgiving
    const thanksgiving = new Date("2019-11-28T00:00");
    rerender(
      <LogScreen
        menu={<div />}
        date={thanksgiving}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    //Check that there are two "Thanksgiving" entries
    expect(await findAllByText(/Thanksgiving/i)).toHaveLength(2);
    expect(queryByText(/4th of July/i)).not.toBeInTheDocument();
    expect(queryByText(/Halloween/i)).not.toBeInTheDocument();
  });

  test("entries are listed in chronological order", async () => {
    await db.logEntries.bulkAdd([
      {
        date: new Date("2019-01-01T04:00"),
        description: "Four O'Clock"
      },
      {
        date: new Date("2019-01-01T02:00"),
        description: "Two O'Clock"
      },
      {
        date: new Date("2019-01-01T01:00"),
        description: "One O'Clock"
      },
      {
        date: new Date("2019-01-01T03:00"),
        description: "Three O'Clock"
      }
    ]);
    const { getByText, getAllByTestId } = renderWithProviders(
      <LogScreen
        menu={<div />}
        date={new Date("2019-01-01T00:00")}
        setDate={jest.fn()}
        routeProps={{}}
      />
    );
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    const renderedDescriptions = getAllByTestId("entryListItemDescription");
    expect(renderedDescriptions).toHaveLength(4);
    expect(renderedDescriptions[0]).toHaveTextContent("One O'Clock");
    expect(renderedDescriptions[1]).toHaveTextContent("Two O'Clock");
    expect(renderedDescriptions[2]).toHaveTextContent("Three O'Clock");
    expect(renderedDescriptions[3]).toHaveTextContent("Four O'Clock");
  });

  test("can add a new entry", async () => {
    const {
      getByText,
      getByLabelText,
      getByTestId,
      findByTestId,
      queryByText
    } = renderWithProviders(
      <Route
        render={routeProps => (
          <LogScreen
            menu={<div />}
            date={new Date()}
            setDate={jest.fn()}
            routeProps={routeProps}
          />
        )}
      />
    );
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    expect(queryByText("Pizza")).not.toBeInTheDocument();

    // Try and create a pizza entry
    fireEvent.click(getByLabelText(/create entry/i));
    await findByTestId("editDialog");
    fireEvent.change(getByLabelText(/what happened/i), {
      target: { value: "Pizza" }
    });
    fireEvent.click(getByLabelText(/save/i));
    await waitForElementToBeRemoved(() => getByTestId("editDialog"));

    // Verify that pizza was added
    await wait(() =>
      expect(getByTestId("entryListItemDescription")).toHaveTextContent("Pizza")
    );
  });

  test("can edit an existing entry", async () => {
    await db.logEntries.add({
      date: new Date("2019-07-04T12:00"),
      description: "4th of July Hot Dog"
    });

    const {
      getByText,
      getByLabelText,
      queryByText,
      findByTestId,
      getByTestId
    } = renderWithProviders(
      <Route
        render={routeProps => (
          <LogScreen
            menu={<div />}
            date={new Date("2019-07-04T00:00")}
            setDate={jest.fn()}
            routeProps={routeProps}
          />
        )}
      />
    );
    await waitForElementToBeRemoved(() => getByText(/loading/i));
    expect(queryByText("4th of July Hot Dog")).toBeInTheDocument();
    expect(queryByText("4th of July Cheeseburger")).not.toBeInTheDocument();

    // Click on the hot dog entry and make edits
    fireEvent.click(getByText(/hot dog/i));
    await findByTestId("editDialog");
    fireEvent.change(getByLabelText(/what happened/i), {
      target: { value: "4th of July Cheeseburger" }
    });
    fireEvent.click(getByLabelText(/save/i));
    await waitForElementToBeRemoved(() => getByTestId("editDialog"));

    // Verify that hot dog goes away
    await wait(() =>
      expect(queryByText("4th of July Hot Dog")).not.toBeInTheDocument()
    );
    // And is replaced with cheeseburger
    expect(getByTestId("entryListItemDescription")).toHaveTextContent(
      "4th of July Cheeseburger"
    );
  });
});
