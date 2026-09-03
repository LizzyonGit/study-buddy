# Chatbot MVP Plan (3 weeks)

Scope
- Simple Next.js chatbot MVP: single-page chat UI + one external API integration (serverless proxy).

Goals
- Minimal flow: user sends message → Next.js server component/server action calls Groq securely → bot reply displayed.
- Preferred frontend architecture: server-first rendering with a small interactive client chat component for input and state updates.

User Stories
- As a user, I want to type a message and send it so that I can receive a response from the chatbot.
- As a user, I want to see my message and the chatbot reply in the same conversation so that I can follow the exchange.
- As a user, I can clear the chat conversation so that I can clear the screen.
- As a user, I want to see a loading state while the chatbot is responding so that I know the app is working.
- As a user, I want to see a clear error message if the chatbot request fails so that I can retry or understand the issue.
- As a developer, I want the frontend to call a Next.js API route so the request is proxied safely.
- As a developer, I want the external API key to be stored in an environment variable so that secrets are not exposed in the source code.
- As a developer, I want basic request logging so that I can debug failed API calls and monitor the app.

Acceptance Criteria
- Chat UI shows messages (user + bot) and scrolls on new messages.
- Serverless route proxies requests to the configured external API and returns the API response.
- API key is read from an env var (no secrets in code).
- Basic end-to-end test that the API route returns 200 for a sample request (can be mocked).

Tech
- Frontend: Next.js, React, simple CSS, with server components preferred for page structure and secure data handling.
- AI provider: Groq for the chatbot response generation.
- Backend: Next.js server actions or route handlers to proxy requests to Groq securely; browser never calls Groq directly.
- App structure: a server-rendered page with a small interactive client component for the chat input and message state.
- Storage: None for MVP (in-memory per page). Optional DB only if persistence needed.

Visual Design & Accessibility
- Use an OKLCH-based color system so the palette is easy to adjust consistently.
- Primary accent: blue for the main interactive actions and active states.
- Secondary accent: purple for supporting highlights and assistant-related accents.
- Contrast color: near-black for primary text, icons, and high-contrast controls.
- Use light neutral backgrounds so blue, purple, and black remain visually distinct.
- Meet WCAG 2.2 AA contrast targets: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for meaningful non-text UI boundaries and focus indicators.
- Verify text, buttons, input borders, focus states, disabled states, and message bubbles with a contrast checker before release.
- Do not communicate meaning through color alone; preserve readable labels and visible focus states.

3-Week Timeline
- Week 1 — Setup & UI (Days 1–7)
  - Scaffold Next.js project and install deps.
  - Build single-page chat UI: message list, input, send button.
  - Define the OKLCH blue, purple, near-black, neutral, border, and focus tokens.
  - Local env var setup (e.g., `.env.local`).
- Week 2 — API Integration (Days 8–14)
  - Implement a Next.js server action or route handler that calls Groq securely (errors, timeouts, and API validation handled).
  - Wire the chat client to the server endpoint; show loading state and bot responses.
  - Add basic logging and env validation for Groq key and request failures.
- Week 3 — Polish, Tests, Deploy (Days 15–21)
  - Add retry/error UX, styling, accessibility fixes, and WCAG contrast verification.
  - Add minimal tests for API route and UI flow.
  - readme

Wireframe (single-page)
- Chat area (vertical message list) in center.
- Bottom input bar with text field and send button.
![(./chatbot-wireframe.png)]

Risks & Mitigations
- API quotas/latency — add retry/backoff and show helpful error messages.
- Secrets exposure — use env vars and do not log API keys.

Next Step Options
- Convert plan to issue-sized tasks.
- Scaffold the Next.js repo and implement Week 1 items.

(Prepared by assistant)
