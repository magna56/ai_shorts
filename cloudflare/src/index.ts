export interface Env {
  DB: D1Database;
  PUBLISH_SECRET: string;
  FEED_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/v1/devices") {
      return register(request, env);
    }
    if (request.method === "POST" && url.pathname === "/v1/notify") {
      return notify(request, env);
    }
    return new Response("Not found", { status: 404 });
  },
};

async function register(request: Request, env: Env): Promise<Response> {
  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    if (typeof body.token === "string") token = body.token.trim();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!token.startsWith("ExponentPushToken")) {
    return new Response("Bad token", { status: 400 });
  }
  await env.DB.prepare(
    "INSERT INTO devices (token, updated_at) VALUES (?, ?) ON CONFLICT(token) DO UPDATE SET updated_at = excluded.updated_at",
  )
    .bind(token, Date.now())
    .run();
  return Response.json({ ok: true });
}

async function notify(request: Request, env: Env): Promise<Response> {
  if (request.headers.get("authorization") !== `Bearer ${env.PUBLISH_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await env.DB.prepare("SELECT token FROM devices").all<{ token: string }>();
  const tokens = (rows.results ?? []).map((row) => row.token);
  const messages = tokens.map((to) => ({
    to,
    title: "EngAI",
    body: "New stories",
    data: { refresh: true },
  }));
  for (let i = 0; i < messages.length; i += 100) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(messages.slice(i, i + 100)),
    });
  }
  return Response.json({ sent: messages.length });
}
