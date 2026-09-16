This is a beginner-friendly Next.js app for a study-buddy AI chatbot.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Study Buddy setup

1. Install dependencies with `npm install`.
2. Create your local environment file:

	```bash
	copy .env.example .env.local
	```

3. Add your Groq API key to `.env.local`:

	```env
	GROQ_API_KEY=your_groq_api_key_here
	```

4. Start the app with `npm run dev` and open http://localhost:3000.

## Windows note

If PowerShell blocks npm scripts, run this once before starting the app:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Alternatively, run `npm run dev` from Command Prompt.

## Security

- Never commit `.env.local`.
- Keep API keys in local environment variables only.
- Use `.env.example` as the safe setup template.





# 🏷️ Study Buddy

---

Study Buddy is an AI chatbot to help students study. Students can ask anything and the bot will answer. 

---



![Screenshot Study Buddy](./screenshot.png)





---

# 🌐 Live Demo


## Live Demo

👉 [Testa applikationen](https://study-buddy-veip-j6dkw1mzs-lizzy-on-git.vercel.app/)
```

---

# 🚀 Features


## Features

- 🔎 Ask questions and get a response
- Scroll to response automatically.
- 🎬 Clear the conversation
- 📱 Responsive design

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

Beskriv exakt hur någon annan startar projektet.

```md
## Installation

1. Klona repositoryt:

   ```bash
   git clone https://github.com/username/movie-explorer.git
   ```

2. Gå till projektmappen:

   ```bash
   cd movie-explorer
   ```

3. Installera dependencies:

   ```bash
   npm install
   ```

4. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```


> [!IMPORTANT]
> En annan utvecklare ska helst kunna starta projektet utan att behöva fråga dig hur det fungerar.

---

# 🔑 Environment Variables

Om projektet använder API-nycklar eller andra miljövariabler bör de dokumenteras.

```md
## Environment Variables

Skapa en `.env`-fil i projektets root:

```env
VITE_API_KEY=your_api_key_here
```
```

Visa **inte** riktiga API-nycklar i README-filen.

Bra:

```env
VITE_API_KEY=your_api_key_here
```

Dåligt:

```env
VITE_API_KEY=abc123-my-real-secret-key
```

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

Beskriv hur tester körs.

```md
## Testing

Run tests with:
npm test
```



The project uses Vitest for automated tests.
```

---

# 🧹 Linting


## Linting

Check the code with ESLint:


npm run lint



---

# 🏗️ Build

Visa hur projektet byggs för produktion.

```md
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


---

# 🐛 Known Issues


## Known Issues

- Mathematical responses do not show correctly.
- Too long responses will be cut off. There should be a button to make the response limit higher for the particular API call one time.

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




