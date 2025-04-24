```markdown
# 🧠 Anime Chat

**Anime Chat** is a customizable anime-themed AI chatbot built with **Next.js**, **Prisma**, **Clerk**, **Tailwind CSS**, and **TanStack Query**. It connects to LLMs like **OpenAI**, **Gemini**, or **Ollama**, enabling immersive real-time character-based conversations.

---

## ✨ Features

- 🎭 Anime-style AI personas with customizable behavior
- 💬 Real-time chat with optimistic UI and loading states
- 🧠 Persistent conversation memory with context
- 🚀 Fast data fetching using TanStack Query
- 🔐 Secure authentication via Clerk
- 💾 PostgreSQL + Prisma for scalable data
- 🎨 Beautiful UI styled with Tailwind CSS

---

## 🧱 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Database:** PostgreSQL via Prisma
- **Auth:** Clerk
- **State & Fetching:** TanStack Query + Axios
- **Styling:** Tailwind CSS
- **LLMs:** Ollama / OpenAI / Gemini

---

## 📁 Structure Overview

```
/app             → Chat UI & routes  
/api/chat        → API for messaging & conversation logic  
/hooks           → `useChatStore` for managing chat logic  
/lib/types.ts    → Shared type definitions  
/prisma/schema   → Database schema  
```

---

## 🔧 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/anime-chat.git
cd anime-chat

# 2. Install dependencies
pnpm install  # or npm install

# 3. Setup .env
cp .env.example .env
# Fill in DATABASE_URL, Clerk keys, LLM API keys

# 4. Setup DB
npx prisma generate
npx prisma migrate dev --name init

# 5. Run dev server
pnpm dev  # or npm run dev
```

---

## 🚀 Deployment

Deploy easily with [Vercel](https://vercel.com), or self-host using Docker (soon™). PostgreSQL can be hosted on [Neon](https://neon.tech) or Railway.

---

## 🤝 Contributing

Anime Chat is still in development! PRs, issues, and ideas are welcome — especially if you vibe with anime, AI, and cool code.

---

## 📄 License

MIT — go wild, but don’t summon cursed AI demons.

---

## ✍️ Created by Khegal, Hydrix

> Built with purpose. Refined through madness. Dreamed into being.
```

---

Let me know if you want branding suggestions, ASCII banners, or a version that includes example character configs too.
