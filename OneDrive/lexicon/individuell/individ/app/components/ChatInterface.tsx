// This component needs browser interactivity, so Next.js renders it as a Client Component.
"use client";

// FormEvent provides the TypeScript type for the form submit event; useState stores changing UI data.
import { FormEvent, useState } from "react";

// A message has an id for React's list rendering, a role for styling and labels, and visible text.
type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

// The conversation starts with one assistant message so the user knows what the app does.
const welcomeMessage: Message = {
  id: 0,
  role: "assistant",
  content:
    "Hi, I’m Study Buddy. Ask me anything you’re learning, and we’ll work through it together.",
};

export default function ChatInterface() {
  // Store all displayed messages, starting with the welcome message.
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  // Store the current value typed into the input field.
  const [input, setInput] = useState("");
  // Track whether a request is in progress so duplicate requests can be prevented.
  const [isLoading, setIsLoading] = useState(false);
  // Store a user-safe error message to display when the request fails.
  const [error, setError] = useState("");

  // Submit the user's question to the server and add the returned answer to the conversation.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Stop the browser from reloading the page during form submission.
    event.preventDefault();
    // Remove leading and trailing whitespace before validating or sending the question.
    const content = input.trim();

    // Ignore blank questions and prevent another request while one is already running.
    if (!content || isLoading) {
      return;
    }

    // Show the user's message immediately, before waiting for the server response.
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: "user", content },
    ]);
    // Empty the input and clear any old error before starting a new request.
    setInput("");
    setError("");
    // Switch the interface into its loading state.
    setIsLoading(true);

    try {
      // Send the question to the local Next.js route, which calls Groq securely on the server.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      // Parse the server response as unknown so it must be validated before use.
      const data: unknown = await response.json();

      // Treat HTTP errors and unexpected response shapes as failed requests.
      if (!response.ok || !isChatResponse(data)) {
        throw new Error(isErrorResponse(data) ? data.error : "Request failed.");
      }

      // Add the validated assistant answer to the same conversation.
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: Date.now(), role: "assistant", content: data.message },
      ]);
    } catch {
      // Show a generic message so technical details and secrets are not exposed to the user.
      setError("Unable to get a response right now.");
    } finally {
      // Leave the loading state whether the request succeeded or failed.
      setIsLoading(false);
    }
  }

  // Reset the conversation to its initial welcome message.
  function clearConversation() {
    setMessages([welcomeMessage]);
    setInput("");
    setError("");
  }

  // Render the chat page, conversation, loading indicator, and message composer.
  return (
    <main className="chat-page">
      <section className="chat-shell" aria-label="Study Buddy chat">
        <header className="chat-header">
          <div className="brand-mark" aria-hidden="true">
            SB
          </div>
          <div>
            <p className="eyebrow">Your learning companion</p>
            <h1>Study Buddy</h1>
          </div>
          <button
            className="clear-button"
            type="button"
            onClick={clearConversation}
            disabled={messages.length === 1 || isLoading}
          >
            Clear
          </button>
        </header>

        {/* aria-live lets assistive technology announce newly added messages. */}
        <div className="message-list" aria-live="polite">
          {/* Render every stored message with styling based on its role. */}
          {messages.map((message) => (
            <article className={`message-row ${message.role}`} key={message.id}>
              <div className="message-label">
                {message.role === "assistant" ? "Study Buddy" : "You"}
              </div>
              <p className="message-bubble">{message.content}</p>
            </article>
          ))}
          {/* Show temporary assistant feedback while the server is processing the question. */}
          {isLoading && (
            <article className="message-row assistant">
              <div className="message-label">Study Buddy</div>
              <p className="message-bubble" role="status">
                Thinking...
              </p>
            </article>
          )}
        </div>

        {/* The form supports both clicking Send and pressing Enter in the input. */}
        <form className="composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="message">
            Your question
          </label>
          <input
            id="message"
            name="message"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What are you studying today?"
            autoComplete="off"
            disabled={isLoading}
          />
          <button type="submit" aria-label="Send message" disabled={isLoading}>
            <span aria-hidden="true">&#8593;</span>
          </button>
        </form>
        {/* Announce request errors immediately to assistive technology. */}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <p className="composer-note">Your message will appear here first.</p>
      </section>
    </main>
  );
}

// Confirm that a server response contains a non-empty assistant message.
function isChatResponse(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string" &&
    Boolean(value.message.trim())
  );
}

// Confirm that an error response contains a readable error string.
function isErrorResponse(value: unknown): value is { error: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  );
}