import React from "react";
import { render, fireEvent } from "react-testing-library";
import AppBar from "../AppBar";

describe("AppBar", () => {
  test("renders the app title", () => {
    const { getByText } = render(
      <AppBar date={new Date()} setDate={jest.fn()} />
    );
    getByText("Fline");
  });

  test("renders the selected date using en-US locale", () => {
    const fourthOfJuly = new Date("2019-07-04T00:00");
    const { getByText } = render(
      <AppBar date={fourthOfJuly} setDate={jest.fn()} />
    );
    getByText("7/4/2019");
  });

  test("moves back a day when clicking the previous button", () => {
    let date = new Date("2019-07-04T00:00");
    const mockSetDate = jest.fn(cb => (date = cb(date)));

    const { getByLabelText } = render(
      <AppBar date={date} setDate={mockSetDate} />
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

    const { getByLabelText } = render(
      <AppBar date={date} setDate={mockSetDate} />
    );

    const nextButton = getByLabelText(/next date/i);

    fireEvent.click(nextButton);
    expect(mockSetDate).toHaveBeenCalledTimes(1);
    expect(date.toString()).toBe(new Date("2019-07-05T00:00").toString());

    fireEvent.click(nextButton);
    expect(mockSetDate).toHaveBeenCalledTimes(2);
    expect(date.toString()).toBe(new Date("2019-07-06T00:00").toString());
  });

  test("clicking the calendar button opens a day picker", () => {
    const { getByLabelText, getByTestId } = render(
      <AppBar date={new Date()} setDate={jest.fn()} />
    );
    const calendarButton = getByLabelText("Day Picker");
    fireEvent.click(calendarButton);
    getByTestId("dayPicker");
  });
});
