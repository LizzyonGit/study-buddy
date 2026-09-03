"use client";

import { FormEvent, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: Message = {
  id: 0,
  role: "assistant",
  content:
    "Hi, I’m Study Buddy. Ask me anything you’re learning, and we’ll work through it together.",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();

    if (!content) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: "user", content },
    ]);
    setInput("");
  }

  function clearConversation() {
    setMessages([welcomeMessage]);
    setInput("");
  }

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
            disabled={messages.length === 1}
          >
            Clear
          </button>
        </header>

        <div className="message-list" aria-live="polite">
          {messages.map((message) => (
            <article className={`message-row ${message.role}`} key={message.id}>
              <div className="message-label">
                {message.role === "assistant" ? "Study Buddy" : "You"}
              </div>
              <p className="message-bubble">{message.content}</p>
            </article>
          ))}
        </div>

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
          />
          <button type="submit" aria-label="Send message">
            <span aria-hidden="true">&#8593;</span>
          </button>
        </form>
        <p className="composer-note">Your message will appear here first.</p>
      </section>
    </main>
  );
}