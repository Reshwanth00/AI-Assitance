# 🧠 AI Assistant – Full Stack Chat Application

A full-stack AI chat application built using **Next.js (App Router)**, **NextAuth**, **PostgreSQL**, **Drizzle ORM**, and **HuggingFace LLMs**.
The app supports persistent conversations, automatic AI tool calling, OAuth authentication, and an infinite-scroll chat interface.

---

## 🚀 Features

* OAuth authentication (Google & GitHub)
* Secure session handling with NextAuth
* Persistent chat conversations per user
* AI responses with automatic tool detection
* Integrated tools:

  * 🌤 Weather information
  * 🏎 Formula 1 race info
  * 📈 Stock prices
* Cursor-based pagination for chat history
* Clean, modern chat UI
* Server-side APIs with database persistence

---

## 🛠 Tech Stack

### Frontend

* **Next.js 16 (App Router)**
* **React**
* **Tailwind CSS**
* **shadcn/ui**

### Backend

* **Next.js API Routes**
* **NextAuth.js**
* **Drizzle ORM**
* **PostgreSQL (Neon)**

### AI

* **HuggingFace Inference API**
* **Meta LLaMA-3 Instruct**

---

## 📦 Required Libraries

Installed via `package.json`:

```bash
next
react
react-dom
next-auth
drizzle-orm
@ai-sdk/huggingface
tailwindcss
clsx
```

---

## 🔑 Environment Setup

Create a file named **`.env.local`** in the project root.

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_generated_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

HUGGINGFACE_API_KEY=your_huggingface_api_key

DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

⚠️ **Do not commit `.env.local` to GitHub.**

---

## 🔐 How to Get API Keys

### 1️⃣ Google OAuth (Login with Google)

1. Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create or select a project
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Choose **Web Application**

**Authorized JavaScript origin**

```
http://localhost:3001
```

**Authorized redirect URI**

```
http://localhost:3001/api/auth/callback/google
```

Copy:

* `Client ID` → `GOOGLE_CLIENT_ID`
* `Client Secret` → `GOOGLE_CLIENT_SECRET`

---

### 2️⃣ GitHub OAuth (Login with GitHub)

1. Visit: [https://github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**

**Application settings**

```
Homepage URL: http://localhost:3001
Callback URL:  http://localhost:3001/api/auth/callback/github
```

Copy:

* `Client ID` → `GITHUB_CLIENT_ID`
* Generate secret → `GITHUB_CLIENT_SECRET`

---

### 3️⃣ HuggingFace API Key (AI Responses)

1. Visit: [https://huggingface.co/](https://huggingface.co/)
2. Create an account
3. Go to **Settings → Access Tokens**
4. Create a token with **Read** access

Set:

```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxx
```

Free tier is sufficient for development.

---

### 4️⃣ PostgreSQL Database (Neon)

1. Visit: [https://neon.tech/](https://neon.tech/)
2. Create a free account
3. Create a new PostgreSQL project
4. Copy the connection string

Example:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

---

### 5️⃣ NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Set it as:

```env
NEXTAUTH_SECRET=generated_secret_here
```

---

## 🗄 Database Setup (Drizzle ORM)

### Generate migrations

```bash
npx drizzle-kit generate
```

### Run migrations

```bash
npx drizzle-kit migrate
```

This creates:

* `chats` table
* `messages` table

---

## ▶️ Running the Project Locally

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

App will be available at:

```
http://localhost:3001
```

---

## 🔄 Authentication Flow

1. User signs in using Google or GitHub
2. NextAuth creates a secure session
3. Middleware protects authenticated routes
4. Chats are scoped per user

---

## 🧠 AI Tool Calling

The AI automatically detects when to call tools:

| User Query      | Tool Used       |
| --------------- | --------------- |
| Weather related | `getWeather`    |
| Formula 1       | `getF1Matches`  |
| Stock prices    | `getStockPrice` |

Tool results are rendered as structured cards in the chat UI.

---

## 📁 Project Structure

```
app/
 ├─ chat/               # Chat UI
 ├─ api/                # Backend APIs
 ├─ login/              # Auth UI
 ├─ providers.tsx       # NextAuth provider
db/
 ├─ schema.ts           # Drizzle schema
 ├─ migrations/         # SQL migrations
lib/
 ├─ auth.ts             # NextAuth config
 ├─ tools.ts            # AI tools
components/
 ├─ chat-sidebar.tsx
```

---

## 🧪 Notes

* Cursor-based pagination is used for performance
* Internal AI reasoning is hidden from UI
* UI improvements are separated from core logic
* Database operations are fully server-side

---

## 🏁 Status

✅ Core functionality complete
🛠 UI polish and modular improvements ongoing

---

## 📌 License

This project is intended for evaluation and learning purposes.
