# Frontend Test Submission

## Scripts

- dev: `npm run dev` (Vite on http://localhost:3000)
- build: `npm run build`
- preview: `npm run preview`

## Env

- `VITE_API_BASE_URL` (e.g., http://localhost:8080)

## Logging

The app uses `LoggingMiddleware/log.ts` via:

```ts
import { Log } from "../../../LoggingMiddleware/log";
await Log("frontend", "info", "page", "Home mounted");
```

Logs are posted to `http://20.244.56.144/evaluation-service/logs`. 