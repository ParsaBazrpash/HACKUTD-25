# MirrorAPI

- Imagine you're a developer at a large firm working with a massive codebase.
- You use 100s of APIs.
- One day one of the APIs you use gets upgraded and now sends different fields in its JSON response.
- Now it's your job to sit there and painfully play spot the difference between the responses of the old and new versions of APIs.
- There should be a way to automate this.....


  
Enter **MIRROR API**! A developer tool that compares two API responses, detects breaking changes, scores the migration risk, and generates a structured change report.  
Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind + shadcn/ui**, and a deterministic JSON diff engine.

---
## How to Run

1) Clone the files
2) Set up API keys in a .env file in the root directory
3) Open python vitual env + install libs in requirements.txt
4) Open nemotron folder and run main.py

then go back to root directory and type npm install and npm run dev.

enjoy!!!

---

## 🔍 What it does

Compare **two JSON API responses** (URLs or local sample files)  
Detect field-level changes:
- Added fields
- Removed fields
- Type changes (`string → array`, `number → object`, etc.)

Generate a **migration risk score (0–100)**  
Visual diff table with grouped changes  
Export **Markdown migration report**  
Works with **real APIs** (e.g., RestCountries, SpaceX, Pokémon)  
Deterministic — no AI hallucinations, fully offline compatible  

---

## Demo Preview (UI Flow)

1. Paste **Old API URL**  
2. Paste **New API URL** (or choose a preset)  
3. Click **Analyze**  
4. View:
   - Risk badge (Low / Medium / High)
   - Summary counters
   - Full diff table by path

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript |
| UI | Tailwind CSS + shadcn/ui components |
| Logic | Custom JSON schema walker + diff + risk scoring |
| API Routes | `/api/fetch` (safe proxy for remote URLs) |
| Demo Data | `public/samples/v1.json` + `v2.json` |
