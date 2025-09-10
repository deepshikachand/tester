import { Log } from "../../../LoggingMiddleware/log";
import { env } from "./env";

const API_BASE = env.apiBaseUrl;

export const apiClient = {
	async createShortUrl(payload: { url: string; validity?: number; shortcode?: string | undefined }) {
		await Log("frontend", "debug", "api", `createShortUrl: start`);
		try {
			const res = await fetch(`${API_BASE}/shorturls`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				await Log("frontend", "error", "api", `createShortUrl failed: ${res.status}`);
				return null;
			}
			const data = await res.json();
			await Log("frontend", "info", "api", `createShortUrl success`);
			return data;
		} catch (e: any) {
			await Log("frontend", "error", "api", `createShortUrl error: ${e?.message ?? e}`);
			return null;
		}
	},
}; 