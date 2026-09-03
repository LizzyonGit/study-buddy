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
