import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ReactionButton } from "../ReactionButton";

describe("ReactionButton", () => {
  it("renders emoji and count correctly", () => {
    const { getByText } = render(
      <ReactionButton label="🔥" count={3} active={false} onPress={() => {}} />
    );

    expect(getByText("🔥")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPressMock = jest.fn();

    const { getByRole } = render(
      <ReactionButton
        label="❤️"
        count={1}
        active={false}
        onPress={onPressMock}
      />
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("does not respond to press when disabled", () => {
    const onPressMock = jest.fn();

    const { getByRole } = render(
      <ReactionButton
        label="✨"
        count={5}
        active={true}
        onPress={onPressMock}
        disabled
      />
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});

describe("ReactionButton - animations", () => {
  it("updates count when props change", () => {
    const { getByText, rerender } = render(
      <ReactionButton label="👏" count={1} active={false} onPress={() => {}} />
    );

    expect(getByText("1")).toBeTruthy();

    rerender(
      <ReactionButton label="👏" count={2} active={false} onPress={() => {}} />
    );

    expect(getByText("2")).toBeTruthy();
  });

  it("still renders emoji on button press", () => {
    const { getByText, getByRole } = render(
      <ReactionButton label="🔥" count={0} active={false} onPress={() => {}} />
    );

    fireEvent.press(getByRole("button"));

    // The static button emoji is always visible
    expect(getByText("🔥")).toBeTruthy();
  });
});
