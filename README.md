# Business Passport (PWA)

> **A digital business passport for young township and rural entrepreneurs.**

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981.svg)](https://web.dev/progressive-web-apps/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)

---

## 🎯 The Core Product Loop: MANAGE → PROVE → GROW

- **MANAGE:** Track daily cash, card, and EFT sales, expenses, and net profit with live cash flow indicators.
- **PROVE:** Automatically convert transaction history into a verified **Business Passport** and an objective **0–100 Readiness Score**.
- **GROW:** Connect with youth grants, supply chain procurement opportunities, and formal markets.

---

## 📂 Project Structure

```text
khula/
├── public/
│   └── favicon.svg           # PWA icon badge
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, BottomNav, Layout shell
│   │   └── dashboard/        # QuickSaleModal, QuickExpenseModal
│   ├── context/
│   │   └── AuthContext.tsx   # Supabase Auth & Session State
│   ├── hooks/
│   │   ├── useSales.ts       # Realtime sales listener & mutations
│   │   ├── useExpenses.ts    # Realtime expenses listener & mutations
│   │   └── useRealtime.ts    # LIVE indicator status hook
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client setup
│   │   └── calculations.ts   # Cash flow, 0-100 Readiness Score & Anomaly engine
│   ├── pages/
│   │   ├── Landing.tsx       # Value proposition & pitch narrative
│   │   ├── Login.tsx         # Sign in & Quick Demo Login
│   │   ├── Register.tsx      # Account creation
│   │   ├── Onboarding.tsx    # 3-step business identity builder
│   │   ├── Dashboard.tsx     # Real-time metrics & cash flow bars
│   │   ├── Transactions.tsx  # Cash flow ledger with demo seeder
│   │   ├── BusinessPassport.tsx # Hero digital passport with share & score
│   │   ├── Opportunities.tsx # Grants & 1-click passport applications
│   │   ├── Profile.tsx       # Enterprise records & compliance details
│   │   └── Settings.tsx      # PWA & offline integrity preferences
│   ├── types/
│   │   └── database.ts       # Strict TypeScript database models
│   ├── App.tsx               # Client routes & protected navigation
│   └── index.css             # Tailwind CSS v4 styling
├── supabase/
│   └── schema.sql            # Full PostgreSQL schema, RLS policies & seed data
├── INSTRUCTIONS.md           # Step-by-step setup and hackathon presentation guide
└── vite.config.ts            # Vite + Tailwind + PWA Service Worker configuration
```

---

## 🚀 Getting Started

Read [INSTRUCTIONS.md](./INSTRUCTIONS.md) for full setup instructions, SQL migration steps, and the 3-minute hackathon pitch flow.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production PWA
npm run build
```
