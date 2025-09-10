(function (global) {
	const DEFAULT_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
	const allowedLevels = new Set(["debug", "info", "warn", "error", "fatal"]);
	const allowedPackages = new Set([
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

	function validateInputs(stack, level, pkg, message) {
		if (String(stack).toLowerCase() !== "frontend") {
			throw new Error("stack must be 'frontend'");
		}
		if (!allowedLevels.has(String(level).toLowerCase())) {
			throw new Error("invalid level");
		}
		if (!allowedPackages.has(String(pkg).toLowerCase())) {
			throw new Error("invalid package");
		}
		if (typeof message !== "string" || message.trim().length === 0) {
			throw new Error("message must be non-empty string");
		}
	}

	async function Log(stack, level, pkg, message, options) {
		options = options || {};
		const endpoint = options.endpoint || DEFAULT_ENDPOINT;
		const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});

		const normalized = {
			stack: String(stack).toLowerCase(),
			level: String(level).toLowerCase(),
			package: String(pkg).toLowerCase(),
			message: String(message),
		};
		validateInputs(normalized.stack, normalized.level, normalized.package, normalized.message);

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers,
				body: JSON.stringify(normalized),
			});
			if (!res.ok) {
				console.warn("Log() request failed", res.status, res.statusText);
				return null;
			}
			return await res.json();
		} catch (err) {
			console.warn("Log() error", err);
			return null;
		}
	}

	// UMD-style export
	if (typeof module !== "undefined" && module.exports) {
		module.exports = { Log };
	} else {
		global.AffordLog = { Log };
	}
})(typeof window !== "undefined" ? window : globalThis); 