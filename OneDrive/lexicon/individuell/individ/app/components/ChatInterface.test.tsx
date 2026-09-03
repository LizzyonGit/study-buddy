import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ChatInterface from "./ChatInterface";

describe("ChatInterface", () => {
  it("shows a submitted user message", async () => {
    const user = userEvent.setup();

    render(<ChatInterface />);

    await user.type(
      screen.getByPlaceholderText("What are you studying today?"),
      "Explain photosynthesis",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByText("Explain photosynthesis")).toBeInTheDocument();
  });

  it("does not submit an empty message", async () => {
    const user = userEvent.setup();

    render(<ChatInterface />);

    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.queryByText("You")).not.toBeInTheDocument();
  });

  it("clears submitted messages and keeps the welcome message", async () => {
    const user = userEvent.setup();

    render(<ChatInterface />);

    await user.type(
      screen.getByPlaceholderText("What are you studying today?"),
      "Test message",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    expect(
      screen.getByText(/Ask me anything you’re learning/),
    ).toBeInTheDocument();
  });
});