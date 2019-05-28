import React from "react";
import { render, fireEvent } from "react-testing-library";
import MockDate from "mockdate";
import EditDialog from "../EditDialog";
import Theme from "../../Theme";
import { ENTRY_TAGS } from "../../constants";

afterEach(() => {
  MockDate.reset();
});

describe("EditDialog", () => {
  test("calls onClose when clicking the X button", () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    const { getByLabelText } = render(
      <EditDialog
        isOpen
        entry={null}
        date={new Date()}
        saveEntry={onSave}
        onClose={onClose}
      />
    );
    fireEvent.click(getByLabelText(/close/i));
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("focuses the description field when opened", () => {
    const { getByLabelText } = render(
      <EditDialog
        isOpen
        entry={null}
        date={new Date()}
        saveEntry={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(getByLabelText(/what happened/i)).toHaveFocus();
  });

  test("shows an error when trying to save an entry with a blank description", () => {
    const saveEntry = jest.fn();
    const { getByText, getByLabelText } = render(
      <EditDialog
        isOpen
        entry={null}
        date={new Date()}
        saveEntry={saveEntry}
        onClose={jest.fn()}
      />
    );
    expect(getByLabelText(/what happened/i).value).toBe("");
    fireEvent.click(getByLabelText(/save/i));
    expect(saveEntry).not.toHaveBeenCalled();
    expect(getByText(/what happened/i)).toHaveStyle("color: #f44336");
  });

  test("displays default form values when creating new entry", () => {
    MockDate.set("2019-07-04T12:30");

    const { getByText, getByLabelText } = render(
      <Theme>
        <EditDialog
          isOpen
          entry={null}
          date={new Date("2019-07-04T00:00")}
          saveEntry={jest.fn()}
          onClose={jest.fn()}
        />
      </Theme>
    );

    expect(getByText(/add something/i)).toBeInTheDocument();
    const descriptionField = getByLabelText(/what happened/i);
    expect(descriptionField.value).toBe("");
    const timeField = getByText(/when/i).nextSibling.querySelector("input");
    expect(timeField.value).toBe("12:30 PM");
    for (let tag of ENTRY_TAGS) {
      // none of the chips should be teal
      expect(getByLabelText(tag)).not.toHaveStyle("background-color: #009688");
      expect(getByLabelText(tag)).toHaveStyle("background-color: transparent");
    }
  });

  test("displays pre-populated form values when editing an existing entry", () => {
    const { getByText, getByLabelText } = render(
      <Theme>
        <EditDialog
          isOpen
          entry={{
            id: 42,
            description: "Hot Dog",
            date: new Date("2019-07-04T12:30"),
            tags: ["meal"]
          }}
          date={new Date("2019-07-04T00:00")}
          saveEntry={jest.fn()}
          onClose={jest.fn()}
        />
      </Theme>
    );

    expect(getByText(/edit something/i)).toBeInTheDocument();
    const descriptionField = getByLabelText(/what happened/i);
    expect(descriptionField.value).toBe("Hot Dog");
    const timeField = getByText(/when/i).nextSibling.querySelector("input");
    expect(timeField.value).toBe("12:30 PM");

    // Only the selected chip should be teal
    expect(getByLabelText("meal")).toHaveStyle("background-color: #009688");
    for (let tag of ENTRY_TAGS) {
      if (tag !== "meal") {
        expect(getByLabelText(tag)).toHaveStyle(
          "background-color: transparent"
        );
      }
    }
  });

  test("only a single chip at a time can be selected", () => {
    const { getByLabelText } = render(
      <Theme>
        <EditDialog
          isOpen
          entry={null}
          date={new Date()}
          saveEntry={jest.fn()}
          onClose={jest.fn()}
        />
      </Theme>
    );

    // All chips are unselected
    ENTRY_TAGS.forEach(tag =>
      expect(getByLabelText(tag)).toHaveStyle("background-color: transparent")
    );

    // One chip is selected
    let selectedTag = ENTRY_TAGS[1];
    fireEvent.click(getByLabelText(selectedTag));
    ENTRY_TAGS.forEach(tag => {
      const color = tag === selectedTag ? "#009688" : "transparent";
      expect(getByLabelText(tag)).toHaveStyle(`background-color: ${color}`);
    });

    // A different chip is now selected
    selectedTag = ENTRY_TAGS[3];
    fireEvent.click(getByLabelText(selectedTag));
    ENTRY_TAGS.forEach(tag => {
      const color = tag === selectedTag ? "#009688" : "transparent";
      expect(getByLabelText(tag)).toHaveStyle(`background-color: ${color}`);
    });
  });

  test("can toggle a chip on/off by clicking twice", () => {
    const { getByLabelText } = render(
      <Theme>
        <EditDialog
          isOpen
          entry={null}
          date={new Date()}
          saveEntry={jest.fn()}
          onClose={jest.fn()}
        />
      </Theme>
    );

    const chip = getByLabelText(ENTRY_TAGS[0]);
    expect(chip).toHaveStyle("background-color: transparent");
    fireEvent.click(chip);
    expect(chip).toHaveStyle("background-color: #009688");
    fireEvent.click(chip);
    expect(chip).toHaveStyle("background-color: transparent");
  });

  test("calls onSave correctly after creating a new entry", () => {
    const fakeNow = "2019-07-04T12:30";
    MockDate.set(fakeNow);
    const saveEntry = jest.fn();

    const { getByLabelText } = render(
      <EditDialog
        isOpen
        entry={null}
        date={new Date("2019-07-04T00:00")}
        saveEntry={saveEntry}
        onClose={jest.fn()}
      />
    );

    fireEvent.change(getByLabelText(/what happened/i), {
      target: { value: "Hot Dog" }
    });
    fireEvent.click(getByLabelText(/meal/i));
    fireEvent.click(getByLabelText(/save/i));

    expect(saveEntry).toHaveBeenCalledTimes(1);
    expect(saveEntry).toHaveBeenCalledWith({
      date: new Date(fakeNow),
      tags: ["meal"],
      description: "Hot Dog"
    });
  });

  test("calls onSave correctly after editing an existing entry", () => {
    const saveEntry = jest.fn();

    const { getByLabelText } = render(
      <EditDialog
        isOpen
        entry={{
          id: 42,
          description: "Hot Dog",
          date: new Date("2019-07-04T12:00"),
          tags: ["meal"]
        }}
        date={new Date("2019-07-04T00:00")}
        saveEntry={saveEntry}
        onClose={jest.fn()}
      />
    );

    fireEvent.change(getByLabelText(/what happened/i), {
      target: { value: "Beer" }
    });
    fireEvent.click(getByLabelText(/alcohol/i));
    fireEvent.click(getByLabelText(/save/i));

    expect(saveEntry).toHaveBeenCalledTimes(1);
    expect(saveEntry).toHaveBeenCalledWith({
      id: 42,
      date: new Date("2019-07-04T12:00"),
      tags: ["alcohol"],
      description: "Beer"
    });
  });
});
