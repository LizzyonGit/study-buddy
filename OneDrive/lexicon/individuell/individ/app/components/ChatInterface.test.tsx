import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChatInterface from "./ChatInterface";

describe("ChatInterface", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a submitted user message", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Plants use light to make food." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<ChatInterface />);

    await user.type(
      screen.getByPlaceholderText("What are you studying today?"),
      "Explain photosynthesis",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByText("Explain photosynthesis")).toBeInTheDocument();
    expect(
      await screen.findByText("Plants use light to make food."),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Explain photosynthesis" }),
    });
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

  it("shows a loading state while waiting for the assistant", async () => {
    const user = userEvent.setup();
    let resolveRequest: (response: Response) => void = () => undefined;
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<ChatInterface />);

    await user.type(
      screen.getByPlaceholderText("What are you studying today?"),
      "Hello",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();

    resolveRequest(
      new Response(JSON.stringify({ message: "Hi there!" }), { status: 200 }),
    );
    expect(await screen.findByText("Hi there!")).toBeInTheDocument();
  });

  it("shows an error when the request fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Unable to get a response right now." }), {
        status: 500,
      }),
    );

    render(<ChatInterface />);

    await user.type(
      screen.getByPlaceholderText("What are you studying today?"),
      "Hello",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(
      await screen.findByText("Unable to get a response right now."),
    ).toBeInTheDocument();
  });
});