# Chatbot MVP Implementation Steps

## 1. Confirm the project root
Work from the real app folder:
- /individ

Do not treat the outer /individuell folder as the app root.

## 2. Create the environment file
Create a file called `.env.local` inside the project root.

Add:

```bash
GROQ_API_KEY=your_key_here
```

Also make sure `.gitignore` contains:

```bash
.env.local
.env
```

## 3. Install the required package
Run:

```bash
npm install groq-sdk
```

This allows the app to call Groq from the server side.

## 4. Create the API route
Create a file:

```bash
app/api/chat/route.ts
```

This file should:
- receive the user message from the frontend
- read `process.env.GROQ_API_KEY`
- call Groq securely on the server side
- return the AI reply as JSON
- handle errors and missing API key gracefully

## 5. Build the chat UI
Update the main page file:

```bash
app/page.tsx
```

The page should include:
- page title
- chat message list
- input field
- send button
- loading indicator
- clear chat button
- error message area

## 6. Create the chat component
Create a component file such as:

```bash
components/ChatInterface.tsx
```

This component should manage:
- message state
- text input state
- loading state
- sending the request to `/api/chat`
- rendering user and bot messages
- error handling

## 7. Connect the UI to the API
When the user clicks Send:
1. read the typed message
2. validate it is not empty
3. add the user message to the chat
4. call the backend route
5. wait for the reply
6. add the AI message to the chat
7. show loading while waiting

## 8. Add error handling
Handle these cases:
- empty message
- missing API key
- failed Groq request
- timeout or network issue

Display a clear message like:

```text
Something went wrong. Please try again.
```

## 9. Test locally
Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Try prompts such as:
- Explain recursion simply
- Make a study plan for 3 days
- Break this project into steps

## 10. Keep the MVP small
Do not add yet:
- auth
- database
- saved chats
- user accounts
- file uploads
- multiple pages
- advanced AI features

Only the core chat flow is required for the MVP.

## 11. Final polish
Before finishing, make sure:
- the UI looks clean
- input works reliably
- the error message appears when needed
- the loading state is visible
- the app runs without crashing

## 12. Next milestone
Once this works, the next useful improvements are:
- chat history in memory or local storage
- better prompt templates
- nicer styling
- deployment to Vercel
