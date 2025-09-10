# Afford Frontend + Logging (very simple guide)

This repo has two things:
- `LoggingMiddleware/` → a tiny logger you can call from frontend.
- `FrontendTestSubmission/` → a React app (Vite) that uses the logger and calls a URL shortener backend.
- `MockBackend/` → a super simple Express server so the UI can work locally.

## 0) Requirements
- Node.js 18+ (or anything recent)

## 1) Start the Mock Backend (so the UI has something to call)
```
cd MockBackend
npm install
npm start
```
- It runs on `http://localhost:8080`
- Endpoints:
  - POST `/shorturls` → returns `{ shortLink, expiry }`
  - GET `/shorturls/:code` → returns stats
  - GET `/:code` → redirect to original URL and record a click

## 2) Set the Frontend to use that backend
Create a file at `FrontendTestSubmission/.env` with this:
```
VITE_API_BASE_URL=http://localhost:8080
```
(If you change ports/hosts, update this value.)

## 3) Run the Frontend
```
cd FrontendTestSubmission
npm install
npm run dev
```
- Open the URL it prints (usually `http://localhost:5173` or `http://localhost:3000`).
- Use the form to create short URLs. Results will show below the form.

## 4) About the Logger
- File: `LoggingMiddleware/log.ts`
- Usage (frontend):
```ts
import { Log } from "../../LoggingMiddleware/log";
await Log("frontend", "info", "page", "Home mounted");
```
- It sends POST requests to `http://20.244.56.144/evaluation-service/logs`.
- Allowed values (frontend):
  - stack: `frontend`
  - level: `debug | info | warn | error | fatal`
  - package: `api | component | hook | page | state | style | auth | config | middleware | utils`

## 5) Notes / Troubleshooting
- If nothing happens when you click Shorten, make sure the backend is running and `.env` is set.
- After changing `.env`, restart `npm run dev`.
- Check browser DevTools → Network to see calls to `/shorturls`.
- Logger failures won’t crash the page; they print warnings to console.

That’s it. Keep it simple. 👍 