# Sweet Shop Management System (Incubyte Assessment)

This repository is a full-stack Sweet Shop Management System scaffold built to satisfy the Incubyte AI Kata assessment requirements.

---

## Tech stack chosen
- Backend: Node.js + Express + Mongoose (MongoDB)
- Frontend: React (Vite)
- Testing: Jest + SuperTest (backend), Vitest/@testing-library (frontend optional)
- TDD: Tests included for core flows (auth, sweets, purchase)

---

## What's included
- `backend/` - API server with auth, sweets CRUD, purchase & restock endpoints.
- `frontend/` - Minimal React app (Vite) with Register, Login, and Dashboard.
- Tests using an in-memory MongoDB for CI-friendly test runs (`mongodb-memory-server`).

---

## Quick start - Backend (recommended)
1. Copy `.env.example` to `.env` and update values (especially `MONGO_URI` and `JWT_SECRET`).
2. Install deps:
```bash
cd backend
npm install
```
3. Run tests (TDD demonstration):
```bash
npm test
```
4. Start server:
```bash
npm run dev
```
The server runs on `http://localhost:4000` by default.

---

## Quick start - Frontend
From repository root:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (typically http://localhost:5173). The frontend expects backend at the same host under `/api` — during local dev, you can use a proxy or set `REACT_APP_API_URL` env to point to `http://localhost:4000`.

---

## Important: TDD & Commit Practice
- Tests are written for auth flows and sweets/purchase endpoints to demonstrate Red->Green->Refactor.
- When AI tools (e.g., ChatGPT) are used to scaffold or assist, include the required `Co-authored-by` trailer in commit messages as per the assessment instructions.

---

## My AI Usage
**Tools used**: ChatGPT (OpenAI) to scaffold the project structure and example tests, and to help craft README and commit message examples.

**How I used AI**:
- Generated initial project scaffold (boilerplate files).
- Suggested Jest/SuperTest test cases and example API design.
- Drafted README and interview-script.

**Reflection**:
I used AI to speed up scaffolding and ensure tests-first examples were present. I reviewed and manually edited all generated code and tests, and will be prepared to explain every line during the interview. Commits where AI was used will include co-author trailers as required.

---

## What to submit
- Push the entire repository to a public GitHub/GitLab repo and share the link.
- Ensure your README shows the "My AI Usage" section and commit history contains co-author trailers where AI helped.

---
