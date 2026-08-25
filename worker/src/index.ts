export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  ADMIN_USER: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  PUBLIC_SITE_ORIGIN: string;
}

const cors = (origin: string | null, env: Env) => {
  const allowed = env.PUBLIC_SITE_ORIGIN || 'https://pcmsomagede.github.io';
  return {
    'access-control-allow-origin': allowed,
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Content-Type, Authorization, Accept',
    'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
    vary: 'Origin',
  };
};

const json = (data: unknown, status = 200, origin: string | null = null, env?: Env, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(env ? cors(origin, env) : {}),
      ...extra,
    },
  });

const toBase64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

async function makeSession(env: Env) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const payload = `admin.${exp}`;
  return `${payload}.${await sign(payload, env.SESSION_SECRET)}`;
}

async function validSession(request: Request, env: Env) {
  const cookie = request.headers.get('cookie') || '';
  const cookieToken = cookie.match(/(?:^|;\s*)cms_session=([^;]+)/)?.[1];
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = cookieToken || bearer;
  if (!token) return false;
  const [user, exp, sig] = token.split('.');
  if (user !== 'admin' || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return sig === await sign(`admin.${exp}`, env.SESSION_SECRET);
}

async function github(env: Env, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'x-github-api-version': '2022-11-28',
      'user-agent': 'pcmsomagede-cms',
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

const slugify = (value: string) => value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
const sameCredential = (input: unknown, expected: string) => typeof input === 'string' && (input === expected || input.trim() === expected.trim());
const encodeUtf8 = (value: string) => btoa(unescape(encodeURIComponent(value)));
const decodeUtf8 = (value: string) => decodeURIComponent(escape(atob(value)));

async function readLoginBody(request: Request) {
  const raw = await request.text();
  if (!raw) return null;
  const contentType = request.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) return JSON.parse(raw) as { username?: unknown; password?: unknown };
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(raw);
      return { username: params.get('username'), password: params.get('password') };
    }
    return JSON.parse(raw) as { username?: unknown; password?: unknown };
  } catch {
    return null;
  }
}

async function readGithubJson(env: Env, path: string) {
  const response = await github(env, `contents/${path}`);
  if (!response.ok) return { response, data: null as unknown };
  const payload = await response.json<{ content?: string; sha?: string }>();
  if (!payload.content) return { response, data: null as unknown };
  return { response, data: JSON.parse(decodeUtf8(payload.content.replace(/\n/g, ''))), sha: payload.sha };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin, env) });

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return json({ ok: true, service: 'pcmsomagede-cms-api', authConfigured: Boolean(env.ADMIN_USER && env.ADMIN_PASSWORD && env.SESSION_SECRET), checks: { adminUser: Boolean(env.ADMIN_USER), adminPassword: Boolean(env.ADMIN_PASSWORD), sessionSecret: Boolean(env.SESSION_SECRET) } }, 200, origin, env);
    }

    if (url.pathname === '/api/login' && request.method === 'POST') {
      const body = await readLoginBody(request);
      if (!body || !sameCredential(body.username, env.ADMIN_USER) || !sameCredential(body.password, env.ADMIN_PASSWORD)) return json({ error: 'Username atau password salah.' }, 401, origin, env);
      if (!env.SESSION_SECRET) return json({ error: 'Konfigurasi sesi CMS belum lengkap.' }, 500, origin, env);
      const token = await makeSession(env);
      return json({ ok: true, user: env.ADMIN_USER, token }, 200, origin, env, { 'set-cookie': `cms_session=${token}; HttpOnly; Secure; SameSite=None; Max-Age=28800; Path=/` });
    }

    if (url.pathname === '/api/logout' && request.method === 'POST') return json({ ok: true }, 200, origin, env, { 'set-cookie': 'cms_session=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/' });
    if (url.pathname === '/api/session' && request.method === 'GET') return json({ authenticated: await validSession(request, env) }, 200, origin, env);

    if (url.pathname === '/api/menu' && request.method === 'GET') {
      try {
        const result = await readGithubJson(env, 'src/data/menu.json');
        if (!result.response.ok) return json({ error: 'Menu belum dapat dibaca.' }, 502, origin, env);
        return json({ ok: true, menu: result.data }, 200, origin, env);
      } catch { return json({ error: 'Format menu tidak valid.' }, 500, origin, env); }
    }

    if (url.pathname === '/api/menu' && request.method === 'PUT') {
      if (!(await validSession(request, env))) return json({ error: 'Sesi tidak valid atau sudah berakhir.' }, 401, origin, env);
      try {
        const menu = await request.json<unknown>();
        if (!Array.isArray(menu) || menu.length === 0) return json({ error: 'Menu harus berupa daftar yang tidak kosong.' }, 400, origin, env);
        const normalized = menu.map((group:any) => ({ label:String(group.label || '').trim(), icon:String(group.icon || '•'), href:String(group.href || '/').trim(), items:Array.isArray(group.items) ? group.items.map((item:any)=>({label:String(item.label || '').trim(),href:String(item.href || '/').trim()})).filter((item:any)=>item.label && item.href) : [] })).filter((group:any)=>group.label && group.href);
        const existing = await github(env, 'contents/src/data/menu.json');
        let sha: string | undefined;
        if (existing.ok) sha = (await existing.json<{sha:string}>()).sha;
        else if (existing.status !== 404) return json({ error: 'Gagal memeriksa menu di GitHub.' }, 502, origin, env);
        const content = JSON.stringify(normalized, null, 2) + '\n';
        const response = await github(env, 'contents/src/data/menu.json', { method:'PUT', body:JSON.stringify({message:'admin: update navigation menu',content:encodeUtf8(content),...(sha?{sha}:{})}) });
        if (!response.ok) return json({ error:'GitHub menolak perubahan menu.', detail:await response.text() }, 502, origin, env);
        return json({ ok:true, menu:normalized, note:'Menu tersimpan ke GitHub dan akan aktif setelah deployment situs selesai.' }, 200, origin, env);
      } catch { return json({ error:'Data menu tidak valid.' }, 400, origin, env); }
    }

    if (url.pathname === '/api/publish' && request.method === 'POST') {
      if (!(await validSession(request, env))) return json({ error: 'Sesi tidak valid atau sudah berakhir.' }, 401, origin, env);
      try {
        const body = await request.json<Record<string, unknown>>();
        const type = String(body.type || 'berita');
        if (!['berita', 'kegiatan', 'agenda'].includes(type)) return json({ error: 'Jenis konten tidak valid.' }, 400, origin, env);
        const slug = slugify(String(body.slug || body.title || ''));
        if (!slug) return json({ error: 'Judul/slug wajib diisi.' }, 400, origin, env);
        const path = `src/content/${type}/${slug}.json`;
        const content = JSON.stringify({ ...body, type, slug, updatedAt: new Date().toISOString() }, null, 2) + '\n';
        const existing = await github(env, `contents/${path}`);
        let sha: string | undefined;
        if (existing.ok) sha = (await existing.json<{ sha: string }>()).sha;
        else if (existing.status !== 404) return json({ error: 'Gagal memeriksa konten di GitHub.' }, 502, origin, env);
        const response = await github(env, `contents/${path}`, { method:'PUT', body:JSON.stringify({message:`${sha?'update':'add'}: ${type} ${slug}`,content:encodeUtf8(content),...(sha?{sha}:{})}) });
        if (!response.ok) return json({ error: 'GitHub menolak publikasi.', detail: await response.text() }, 502, origin, env);
        return json({ ok: true, published: true, path, slug }, 200, origin, env);
      } catch { return json({ error: 'Data konten tidak valid.' }, 400, origin, env); }
    }

    return json({ error: 'Not found' }, 404, origin, env);
  },
};
