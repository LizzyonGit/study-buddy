import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { createCompletion } = vi.hoisted(() => ({
  createCompletion: vi.fn(),
}));

vi.mock("groq-sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: createCompletion,
      },
    },
  })),
}));

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("GROQ_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the assistant response for a valid message", async () => {
    createCompletion.mockResolvedValue({
      choices: [{ message: { content: "Photosynthesis makes food for plants." } }],
    });

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "What is photosynthesis?" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Photosynthesis makes food for plants.",
    });
    expect(createCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: "user", content: "What is photosynthesis?" }],
      }),
    );
  });

  it("rejects an empty message", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "   " }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "A message is required." });
    expect(createCompletion).not.toHaveBeenCalled();
  });

  it("returns a configuration error when the API key is missing", async () => {
    vi.stubEnv("GROQ_API_KEY", "");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Hello" }),
      }),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "The chat service is not configured.",
    });
    expect(createCompletion).not.toHaveBeenCalled();
  });

  it("rejects an oversized message", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "a".repeat(4001) }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Your message is too long.",
    });
    expect(createCompletion).not.toHaveBeenCalled();
  });

  it("returns a safe error when Groq fails", async () => {
    createCompletion.mockRejectedValue(new Error("secret provider details"));

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Hello" }),
      }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();

    expect(body).toEqual({
      error: "Unable to get a response right now.",
    });
    expect(JSON.stringify(body)).not.toContain("secret provider details");
  });
});