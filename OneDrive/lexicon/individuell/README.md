# 🏷️ Study Buddy

---

Study Buddy is an AI chatbot to help students study. Students can ask anything and the bot will answer. 

---



![Screenshot Study Buddy](individ/docs/screenshot.png)





---

# 🌐 Live Demo


## Live Demo

👉 [Testa applikationen](https://study-buddy-veip-j6dkw1mzs-lizzy-on-git.vercel.app/)


---

# 🚀 Features


## Features

- Ask questions and get a response.
- Scroll to response automatically.
- Clear the conversation.
- Responsive design.

---

# 🛠️ Technologies


## Technologies

- HTML
- CSS
- TypeScript
- React
- AI
- Git
- GitHub

---

# 📦 Installation


## Getting Started

Clone the repository:

   ```bash
   git clone https://github.com/LizzyonGit/study-buddy.git
   ```

Go to the project folder:

   ```bash
   cd individ
   ```

Install dependencies:

  ```bash
  npm install

  ```

Run the development server:

  ```bash
  npm run dev

  ```



This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






---

# 🔑 Environment Variables




## Environment Variables

Create your local environment file:

	```bash
	copy .env.example .env.local
	```

Add your Groq API key to `.env.local`:

	```env
	GROQ_API_KEY=your_groq_api_key_here
	```

### Security

- Never commit `.env.local`.
- Keep API keys in local environment variables only.
- Use `.env.example` as the safe setup template.
---

# ▶️ Usage

## Usage

1. Open the application.
2. Write a question.
3. Click Send.
4. Read the response.
5. Repeat.
6. Click Clear or X to clear the conversation.

---


---

# 🧠 How It Works


## How It Works

The application gets a response from an external API.

When the user sends a message. 

1. The message is sent.
2. There is an API-fetch.
3. The API response is converted to a message.
4. The message is rendered as a response component.
5. The page scrolls down to the start of the response message.



---

# 🔌 API


## API

The Project uses Groq API to get a response from the chatbot.


[Groq API documentation](https://console.groq.com/docs/overview)


---

# 📋 Requirements


## Requirements

- Node.js 20+
- npm
- Git


---

# 🧪 Testing




## Testing

Run tests with:
```md
npm test
npx playwright test
```


The project uses Vitest and Playwright for automated tests.


---

# 🧹 Linting


## Linting

Check the code with ESLint:

```md
npm run lint
```


---

# 🏗️ Build




## Build

```bash
npm run build
```


---

# 🗺️ Roadmap


## Roadmap

- [ ] Copy response
- [ ] Dark mode
- [ ] Save conversations
- [ ] Choose different models
- [ ] Multichat with several users
- [ ] Scroll down even when posting long user messages


---

# 🐛 Known Issues


## Known Issues

- Mathematical responses do not show correctly.
- Too long responses will be cut off. There should be a button to make the response limit higher for the particular API call one time.
- Too long user message does not giva an appropriate error message. It should say it is too long.
- Safari is currently not supported.
---



# 👥 Authors

## Author

**Lizzy van Rhijn**

- GitHub: [@lizzy](https://github.com/LizzyonGit)
- LinkedIn: [Lizzy van Rhijn](https://www.linkedin.com/in/lizzy-v-312528321/)



---

# 🙏 Credits / Acknowledgements


## Credits

- Favicon and logo from [Canva](https://www.canva.com/)
- Responses from Groq [Groq](https://groq.com/)
- Copilot, ChatGPT




