# Business Passport (PWA) — Complete Setup & Hackathon Guide

Welcome to **Business Passport**, a Progressive Web App (PWA) built for young township and rural entrepreneurs to:
**MANAGE** (Sales, Expenses & Cash Flow) → **PROVE** (Business Passport & Readiness Score) → **GROW** (Grants, Procurement & Market Access).

---

## 🚀 Quick Start Summary

1. **Database Setup:** Run `supabase/schema.sql` inside your [Supabase SQL Editor](https://supabase.com/dashboard/project/cjoevunnztsdkmobwcvr/sql).
2. **Start Development Server:** Run `npm run dev` in your terminal.
3. **Open App:** Visit `http://localhost:5173` in your browser.
4. **Present Demo in 3 Minutes:** Follow the built-in demo guide below.

---

## Step 1: Run the Database Migrations in Supabase

Your Supabase project is:
- **Project URL:** `https://cjoevunnztsdkmobwcvr.supabase.co`

### How to apply the schema:
1. Open your browser and go to your Supabase Project Dashboard:
   👉 **[Supabase Project Dashboard](https://supabase.com/dashboard/project/cjoevunnztsdkmobwcvr)**
2. In the left navigation menu, click **SQL Editor**.
3. Click **New Query**.
4. Open the file `supabase/schema.sql` located in this project folder.
5. Copy its entire contents and paste it into the Supabase SQL editor.
6. Click the green **Run** button at the bottom right.
7. You should see `Success. No rows returned`. All tables (`businesses`, `sales`, `expenses`, `invoices`, `documents`, `opportunities`, `applications`), Row Level Security policies, and Realtime publications are now active!

---

## Step 2: Running the PWA Locally

In your PowerShell or Command Prompt (Node version: `v26.2.0`):

```bash
# 1. Navigate to the project folder (if not already there)
cd "c:\Users\khamera\OneDrive\Desktop\Hackathon-Khula\khula"

# 2. Start the Vite development server
npm run dev
```

You will see:
```text
  VITE v8.3.3  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open `http://localhost:5173` in Google Chrome or Microsoft Edge.

---

## Step 3: Hackathon 3-Minute Presentation Demo Story

The app has built-in demo shortcuts to let you demonstrate the entire user journey smoothly:

### 1. Landing Page (`0:00 - 0:30`)
- Open `http://localhost:5173/`.
- Explain the problem statement:
  > *"Young township and rural entrepreneurs trade every day, but struggle to access formal credit, supply chains, and grants because they lack a verified digital record. Business Passport bridges this gap."*
- Click **Sign In** or **Get Started**.

### 2. Sign In or Demo Login (`0:30 - 1:00`)
- On the Login screen (`/login`), click the green button:
  👉 **Quick Demo Login (Thandi's Catering)**
- This instantly signs in as `demo@businesspassport.co.za` and directs you to the live dashboard.
- *(Or register a fresh account and use the "Pre-fill Thandi's Catering" button on onboarding!)*

### 3. Record Live Transactions (`1:00 - 1:45`)
- Go to **Transactions & Cash Flow** (`/transactions`).
- Notice the **"Seed Pitch Demo (Thandi's)"** button:
  - Click it to automatically log Thandi's exact demo records:
    - **Sales:** R450, R800, R1,200, R600
    - **Expenses:** Stock (R600), Transport (R250), Packaging (R300)
- Watch the **Live Realtime Sync** update instantly:
  - **Revenue:** R3,050
  - **Expenses:** R1,150
  - **Estimated Profit:** R1,900
- Show the **Anomaly Fraud Protection MVP**:
  - Click **+ Sale** and enter `R25,000`.
  - Notice the automated warning banner: *"⚠ Unusual transaction detected. Please verify this transaction before submitting."*

### 4. Hero Feature: The Business Passport (`1:45 - 2:30`)
- Navigate to **Business Passport** (`/passport`).
- Show the digital passport card:
  - Enterprise Name: *Thandi's Catering*
  - Location: *Soweto, Gauteng*
  - Status: *Active Trading Business*
  - Passport ID: *BP-ZA-XXXXXXXX*
  - **Readiness Score:** *61 / 100 — Opportunity Ready* (improved from initial 32!)
- Click **Share Passport** to demonstrate sharing credentials with funders and corporate buyers.

### 5. Access Opportunities & Funding (`2:30 - 3:00`)
- Navigate to **Opportunities** (`/opportunities`).
- Show the matched opportunities:
  - *Youth Township Micro-Grant (R25,000)*
  - *Local Retail Fresh Produce & Catering Supply (R15,000 - R80,000)*
- Click **Check Eligibility & Apply** on the catering contract.
- The modal automatically bundles the verified Business Passport, sales count, and readiness score.
- Click **Submit Application** — instantly saved and displayed in "My Submitted Applications".

---

## Step 4: Installing as a PWA (Mobile & Desktop)

- In **Google Chrome** on your computer, click the **Install icon** in the address bar (or menu `...` → *Install Business Passport*).
- On **Android / iPhone**:
  - Open the site in Chrome or Safari.
  - Tap `Share` or `Menu` → **Add to Home Screen**.
  - The app will launch in full-screen standalone mode like a native app!

---

## Step 5: Pushing to Your GitHub Profile

Since you already have a GitHub profile, follow these steps to upload your repository:

1. Open [GitHub](https://github.com/new) and click **New Repository**.
2. Name it `business-passport` (or `khula-business-passport`).
3. Leave "Initialize with README" unchecked and click **Create repository**.
4. In your terminal, run:

```bash
cd "c:\Users\khamera\OneDrive\Desktop\Hackathon-Khula\khula"

# 1. Stage and commit all files
git add .
git commit -m "feat: Business Passport PWA for township and rural entrepreneurs"

# 2. Rename branch to main
git branch -M main

# 3. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/business-passport.git

# 4. Push to GitHub
git push -u origin main
```

---

## 🛠 Tech Stack Details

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **PWA:** `vite-plugin-pwa` + Web App Manifest + Service Worker
- **Backend / Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Realtime:** Supabase WebSocket channels for instant cash flow recalculations

---

*Built with ❤️ for the Khula Hackathon.*
