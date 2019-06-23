import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import MockDate from "mockdate";
import Theme from "../../Theme";
import AppBar from "../AppBar";

afterEach(() => {
  MockDate.reset();
});

const AllTheProviders = ({ children }) => (
  <Theme>
    <MemoryRouter initialEntries={["/log"]}>{children}</MemoryRouter>
  </Theme>
);

// Re-usable helper function for setting up data providers between test cases
const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe("AppBar", () => {
  test("renders the word today if the selected date is today", () => {
    MockDate.set("2019-07-04T12:30");
    const fourthOfJuly = new Date("2019-07-04T00:00");
    const { getByText } = renderWithProviders(
      <AppBar date={fourthOfJuly} menu={<div />} setDate={jest.fn()} />
    );
    getByText(/today/i);
  });

  test("renders the selected date in en-US locale if not today's date", () => {
    const secondOfJuly = new Date("2019-07-02T00:00");
    const fourthOfJuly = new Date("2019-07-04T00:00");
    MockDate.set(secondOfJuly);
    const { getByText } = renderWithProviders(
      <AppBar menu={<div />} date={fourthOfJuly} setDate={jest.fn()} />
    );
    getByText("7/4/2019");
  });

  test("moves back a day when clicking the previous button", () => {
    let date = new Date("2019-07-04T00:00");
    const mockSetDate = jest.fn(cb => (date = cb(date)));

    const { getByLabelText } = renderWithProviders(
      <AppBar menu={<div />} date={date} setDate={mockSetDate} />
    );

    const prevButton = getByLabelText(/previous date/i);

    fireEvent.click(prevButton);
    expect(mockSetDate).toHaveBeenCalledTimes(1);
    expect(date.toString()).toBe(new Date("2019-07-03T00:00").toString());

    fireEvent.click(prevButton);
    expect(mockSetDate).toHaveBeenCalledTimes(2);
    expect(date.toString()).toBe(new Date("2019-07-02T00:00").toString());
  });

  test("moves forward a day when clicking the next button", () => {
    let date = new Date("2019-07-04T00:00");
    const mockSetDate = jest.fn(cb => (date = cb(date)));

    const { getByLabelText } = renderWithProviders(
      <AppBar menu={<div />} date={date} setDate={mockSetDate} />
    );

    const nextButton = getByLabelText(/next date/i);

    fireEvent.click(nextButton);
    expect(mockSetDate).toHaveBeenCalledTimes(1);
    expect(date.toString()).toBe(new Date("2019-07-05T00:00").toString());

    fireEvent.click(nextButton);
    expect(mockSetDate).toHaveBeenCalledTimes(2);
    expect(date.toString()).toBe(new Date("2019-07-06T00:00").toString());
  });

  test("clicking the explore button navigates to the explore screen", () => {
    let location;
    const { getByLabelText } = renderWithProviders(
      <Route>
        {routeProps => {
          location = routeProps.location;
          return (
            <AppBar menu={<div />} date={new Date()} setDate={jest.fn()} />
          );
        }}
      </Route>
    );
    fireEvent.click(getByLabelText("Explore"));
    expect(location.pathname).toBe("/log/explore");
  });
});
