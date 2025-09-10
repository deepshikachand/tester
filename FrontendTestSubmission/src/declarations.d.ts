declare module "../../../LoggingMiddleware/log" {
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
	export interface LogResponse { logID: string; message: string }
	export interface LogOptions { endpoint?: string; headers?: Record<string, string>; timeoutMs?: number }
	export function Log(
		stack: Stack,
		level: Level,
		pkg: FrontendPackage,
		message: string,
		options?: LogOptions,
	): Promise<LogResponse | null>;
} 