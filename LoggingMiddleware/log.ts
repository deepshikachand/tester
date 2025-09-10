export type Stack = "frontend";

export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type FrontendPackage =
	| "api"
	| "component"
	| "hook"
	| "page"
	| "state"
	| "style"
	| "auth"
	| "config"
	| "middleware"
	| "utils";

export interface LogResponse {
	logID: string;
	message: string;
}

export interface LogOptions {
	endpoint?: string;
	headers?: Record<string, string>;
	timeoutMs?: number;
	fetchImpl?: typeof fetch;
}

const DEFAULT_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

const allowedLevels: ReadonlySet<Level> = new Set([
	"debug",
	"info",
	"warn",
	"error",
	"fatal",
]);

const allowedPackages: ReadonlySet<FrontendPackage> = new Set([
	"api",
	"component",
	"hook",
	"page",
	"state",
	"style",
	"auth",
	"config",
	"middleware",
	"utils",
]);

function validateInputs(
	stack: string,
	level: string,
	pkg: string,
	message: unknown,
): asserts stack is Stack & string {
	if (stack.toLowerCase() !== "frontend") {
		throw new Error("stack must be 'frontend' for the frontend track");
	}
	if (!allowedLevels.has(level.toLowerCase() as Level)) {
		throw new Error(
			"level must be one of: debug | info | warn | error | fatal",
		);
	}
	if (!allowedPackages.has(pkg.toLowerCase() as FrontendPackage)) {
		throw new Error(
			"package must be one of: api, component, hook, page, state, style, auth, config, middleware, utils",
		);
	}
	if (typeof message !== "string" || message.trim().length === 0) {
		throw new Error("message must be a non-empty string");
	}
}

export async function Log(
	stack: Stack,
	level: Level,
	pkg: FrontendPackage,
	message: string,
	options: LogOptions = {},
): Promise<LogResponse | null> {
	const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
	const fetchImpl = options.fetchImpl ?? fetch;
	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	// Normalize to lowercase to satisfy API constraints
	const normalized = {
		stack: String(stack).toLowerCase(),
		level: String(level).toLowerCase(),
		package: String(pkg).toLowerCase(),
		message: String(message),
	};

	validateInputs(normalized.stack, normalized.level, normalized.package, normalized.message);

	const controller = typeof AbortController !== "undefined" ? new AbortController() : undefined;
	const timeoutMs = options.timeoutMs ?? 8000;
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	if (controller) {
		timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	}

	try {
		const init: RequestInit = {
			method: "POST",
			headers,
			body: JSON.stringify(normalized),
		};
		if (controller) {
			init.signal = controller.signal;
		}

		const res = await fetchImpl(endpoint, init);

		if (!res.ok) {
			// Do not throw to avoid breaking the app; surface via console
			console.warn("Log() request failed", res.status, res.statusText);
			return null;
		}

		const data = (await res.json()) as LogResponse;
		return data;
	} catch (error) {
		console.warn("Log() error", error);
		return null;
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
}

export function createLogger(defaults: {
	level?: Level;
	package?: FrontendPackage;
	options?: LogOptions;
}) {
	return async function logWithDefaults(
		message: string,
		overrides?: Partial<{ level: Level; package: FrontendPackage; options: LogOptions }>,
	) {
		return Log(
			"frontend",
			overrides?.level ?? (defaults.level ?? "info"),
			overrides?.package ?? (defaults.package ?? "utils"),
			message,
			{ ...(defaults.options ?? {}), ...(overrides?.options ?? {}) },
		);
	};
} 