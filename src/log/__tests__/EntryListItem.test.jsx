import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { render, fireEvent } from "react-testing-library";
import EntryListItem from "../EntryListItem";

const FAKE_ENTRY = {
  id: 100,
  description: "Ate a lot of Halloween candy",
  date: new Date("2019-10-31T18:45:00"),
  tags: []
};

const FAKE_LEVELS = [
  { date: new Date("2019-10-31T18:45:00"), level: 160 },
  { date: new Date("2019-10-31T18:50:00"), level: 180 },
  { date: new Date("2019-10-31T18:55:00"), level: 200 }
];

describe("EntryListItem", () => {
  test("renders the entry description", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/log"]}>
        <EntryListItem entry={FAKE_ENTRY} />
      </MemoryRouter>
    );
    getByText(FAKE_ENTRY.description);
  });

  test("renders the localized entry time", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/log"]}>
        <EntryListItem entry={FAKE_ENTRY} />
      </MemoryRouter>
    );
    const formattedDate = FAKE_ENTRY.date.toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit"
    });
    getByText(formattedDate);
  });

  test("renders a graph if passed any glucose data", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/log"]}>
        <EntryListItem entry={FAKE_ENTRY} bloodGlucoseLevels={FAKE_LEVELS} />
      </MemoryRouter>
    );
    getByTestId("entryListItemGraphContainer");
  });

  test("navigates to the edit dialog URL when clicked on", () => {
    let editDialogUrlMatched = false;
    const { getByText } = render(
      <MemoryRouter initialEntries={["/log"]}>
        <EntryListItem entry={FAKE_ENTRY} bloodGlucoseLevels={FAKE_LEVELS} />
        <Route
          path={`/log/edit/${FAKE_ENTRY.id}`}
          render={() => (editDialogUrlMatched = true)}
        />
      </MemoryRouter>
    );

    expect(editDialogUrlMatched).toBe(false);
    fireEvent.click(getByText(FAKE_ENTRY.description));
    expect(editDialogUrlMatched).toBe(true);
  });
});
