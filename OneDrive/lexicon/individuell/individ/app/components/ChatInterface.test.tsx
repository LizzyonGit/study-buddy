import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChatInterface from "./ChatInterface";

describe("ChatInterface", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
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
      screen.getByPlaceholderText("Ask away!"),
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

  it("scrolls to the newest conversation content", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "A new answer" }), { status: 200 }),
    );

    render(<ChatInterface />);

    await user.type(screen.getByPlaceholderText("Ask away!"), "New question");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByText("A new answer");

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
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
      screen.getByPlaceholderText("Ask away!"),
      "Test message",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    expect(
      screen.getByText(/How can I help you learn today/),
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
      screen.getByPlaceholderText("Ask away!"),
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
      screen.getByPlaceholderText("Ask away!"),
      "Hello",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(
      await screen.findByText("Unable to get a response right now."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("retries the last message with the existing send button", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(global, "fetch");
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "Try again" }), { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "Recovered response" }), { status: 200 }));

    render(<ChatInterface />);

    await user.type(screen.getByPlaceholderText("Ask away!"), "Retry this");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByRole("button", { name: "Try again" });
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Recovered response")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Retry this" }),
    });
  });
});