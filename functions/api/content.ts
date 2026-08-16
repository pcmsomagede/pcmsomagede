export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  ADMIN_USER: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
}

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sessionToken(env: Env) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const payload = `admin.${exp}`;
  return `${payload}.${await sign(payload, env.SESSION_SECRET)}`;
}

async function validSession(request: Request, env: Env) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const [user, exp, sig] = token.split('.');
  if (user !== 'admin' || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = await sign(`admin.${exp}`, env.SESSION_SECRET);
  return sig === expected;
}

async function github(request: Request, env: Env, path: string, init: RequestInit = {}) {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/${path}`;
  return fetch(url, {
    ...init,
    headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${env.GITHUB_TOKEN}`, 'x-github-api-version': '2022-11-28', 'user-agent': 'pcmsomagede-cms', ...(init.headers || {}) },
  });
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  if (request.method === 'POST' && url.pathname.endsWith('/login')) {
    const body = await request.json<{ username?: string; password?: string }>();
    if (body.username !== env.ADMIN_USER || body.password !== env.ADMIN_PASSWORD) return json({ error: 'Kredensial tidak valid.' }, 401);
    return new Response(JSON.stringify({ ok: true, token: await sessionToken(env) }), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'set-cookie': `cms_session=1; HttpOnly; Secure; SameSite=Strict; Max-Age=28800; Path=/` } });
  }

  if (!(await validSession(request, env))) return json({ error: 'Unauthorized' }, 401);

  if (request.method === 'POST' && url.pathname.endsWith('/publish')) {
    const body = await request.json<Record<string, unknown>>();
    const type = String(body.type || 'berita');
    const slug = String(body.slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) return json({ error: 'Slug wajib diisi.' }, 400);
    if (!['berita', 'kegiatan', 'agenda'].includes(type)) return json({ error: 'Jenis konten tidak valid.' }, 400);
    const path = `src/content/${type}/${slug}.json`;
    const content = JSON.stringify({ ...body, type, slug, updatedAt: new Date().toISOString() }, null, 2) + '\n';
    const existing = await github(request, env, `contents/${path}`);
    let sha: string | undefined;
    if (existing.ok) sha = (await existing.json<{ sha: string }>()).sha;
    const response = await github(request, env, `contents/${path}`, { method: 'PUT', body: JSON.stringify({ message: `${sha ? 'update' : 'add'}: ${type} ${slug}`, content: btoa(unescape(encodeURIComponent(content))), ...(sha ? { sha } : {}) }) });
    if (!response.ok) return json({ error: 'GitHub tidak menerima konten.', detail: await response.text() }, 502);
    return json({ ok: true, path, published: true });
  }

  return json({ ok: true, service: 'pcmsomagede-cms-api' });
};
