/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === 'POST') {
			await env.CACHE.delete('number');

			return Response.redirect(request.url);
		}

		let number = await env.CACHE.get('number');

		if (number === null) {
			number = Math.random().toString();
			await env.CACHE.put('number', number);
		}

		return new Response(
			`
			<!DOCTYPE html>
			<html>
				<head>
				</head>
				<body>
					<h1>Random number (cached): ${number}</h1>
					<form method="post">
						<button>Delete cache</button>
					</form>
				</body>
			</html>	
		`,
			{
				headers: {
					'content-type': 'text/html; charset=utf-8',
				},
			}
		);
	},
} satisfies ExportedHandler<Env>;
