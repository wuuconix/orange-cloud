const APP_CALLBACK = "orangecloud://oauth/callback";

export default {
	fetch(request: Request): Response {
		const url = new URL(request.url);
		if (url.pathname !== "/oauth/callback") {
			return new Response("Not Found", { status: 404 });
		}

		const callback = new URL(APP_CALLBACK);
		const error = url.searchParams.get("error");
		if (error) {
			callback.searchParams.set("error", url.searchParams.get("error_description") ?? error);
			return Response.redirect(callback, 302);
		}

		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		if (!code || !state) {
			callback.searchParams.set("error", "invalid_response");
			return Response.redirect(callback, 302);
		}

		callback.searchParams.set("code", code);
		callback.searchParams.set("state", state);
		return Response.redirect(callback, 302);
	},
} satisfies ExportedHandler;
