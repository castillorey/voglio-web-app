import { Page, Route } from "@playwright/test";

export const SUPABASE_URL = "https://useejgiprosrfiabgukn.supabase.co";
export const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";
export const TEST_FRIEND_ID = "00000000-0000-0000-0000-000000000002";
export const TEST_USER_EMAIL = "test@voglio.app";
export const TEST_USERNAME = "testuser";
export const TEST_DISPLAY_NAME = "Test User";

export interface FakeCategory {
  id: number;
  name: string;
  description: string;
  emoji_code: string;
  is_private: boolean;
  user_id: string;
}

export interface FakeVoglio {
  id: number;
  name: string;
  notes: string;
  price: number | null;
  category_id: number;
  reference_link: string;
  size_id: number | null;
  image_url: string | null;
  quantity: number;
  is_private: boolean;
  is_taken: boolean;
  user_id: string;
}

export interface FakeProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  birth_date: string | null;
  gender: string | null;
  shirt_size: string | null;
  pants_size: string | null;
  shoe_size: string | null;
  sizing_format: string | null;
  zodiac_sign: string | null;
  created_at: string;
}

export interface FakeFollow {
  follower_id: string;
  following_id: string;
}

export interface FakeTaken {
  voglio_id: number;
  user_id: string;
  created_at: string;
}

export interface MockDB {
  categories: FakeCategory[];
  voglios: FakeVoglio[];
  profiles: FakeProfile[];
  follows: FakeFollow[];
  taken: FakeTaken[];
}

export const defaultDB = (): MockDB => ({
  categories: [
    {
      id: 1,
      name: "Birthday",
      description: "Gifts for my birthday",
      emoji_code: "🎂",
      is_private: false,
      user_id: TEST_USER_ID,
    },
    {
      id: 2,
      name: "Christmas",
      description: "",
      emoji_code: "🎄",
      is_private: true,
      user_id: TEST_USER_ID,
    },
  ],
  voglios: [
    {
      id: 10,
      name: "Mechanical Keyboard",
      notes: "A nice keyboard for work",
      price: 120,
      category_id: 1,
      reference_link: "https://example.com/keyboard",
      size_id: null,
      image_url: "https://example.com/keyboard.jpg",
      quantity: 1,
      is_private: false,
      is_taken: false,
      user_id: TEST_USER_ID,
    },
    {
      id: 11,
      name: "Running Shoes",
      notes: "",
      price: 89,
      category_id: 1,
      reference_link: "",
      size_id: null,
      image_url: null,
      quantity: 1,
      is_private: false,
      is_taken: false,
      user_id: TEST_USER_ID,
    },
  ],
  profiles: [
    {
      id: TEST_USER_ID,
      username: TEST_USERNAME,
      display_name: TEST_DISPLAY_NAME,
      avatar_url: null,
      location: "Madrid, España",
      birth_date: "1990-06-15",
      gender: "other",
      shirt_size: "M",
      pants_size: null,
      shoe_size: null,
      sizing_format: "US",
      zodiac_sign: "Gemini",
      created_at: "2024-01-01T00:00:00.000Z",
    },
    {
      id: TEST_FRIEND_ID,
      username: "friend1",
      display_name: "Friend One",
      avatar_url: null,
      location: "Lisbon, Portugal",
      birth_date: null,
      gender: null,
      shirt_size: null,
      pants_size: null,
      shoe_size: null,
      sizing_format: "US",
      zodiac_sign: null,
      created_at: "2024-01-02T00:00:00.000Z",
    },
  ],
  follows: [{ follower_id: TEST_USER_ID, following_id: TEST_FRIEND_ID }],
  taken: [],
});

function b64url(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function makeJwt(payload: Record<string, unknown>): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

export function makeAccessToken(overrides: Record<string, unknown> = {}): string {
  const now = Math.floor(Date.now() / 1000);
  return makeJwt({
    aud: "authenticated",
    exp: now + 3600,
    iat: now,
    sub: TEST_USER_ID,
    email: TEST_USER_EMAIL,
    role: "authenticated",
    ...overrides,
  });
}

const AUTH_SESSION_KEY = `sb-${new URL(SUPABASE_URL).hostname.split(".")[0]}-auth-token`;

export function injectSession(page: Page, overrides: Record<string, unknown> = {}) {
  const session = {
    access_token: makeAccessToken(overrides),
    refresh_token: "fake-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: {
      id: TEST_USER_ID,
      aud: "authenticated",
      role: "authenticated",
      email: TEST_USER_EMAIL,
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: {},
      created_at: "2024-01-01T00:00:00.000Z",
    },
  };
  return page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [AUTH_SESSION_KEY, JSON.stringify(session)],
  );
}

type Json = Record<string, unknown> | unknown[];

function ok(route: Route, body: Json, status = 200) {
  const accept = route.request().headers()["accept"] ?? "";
  if (accept.includes("application/vnd.pgrst.object+json")) {
    if (Array.isArray(body)) {
      if (body.length === 1) {
        return route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body[0]),
        });
      }
      return route.fulfill({
        status: 406,
        contentType: "application/json",
        body: JSON.stringify({
          code: "PGRST116",
          details: `Results contain ${body.length} rows, application/vnd.pgrst.object+json requires 1 row`,
          hint: null,
          message: "JSON object requested, multiple (or no) rows returned",
        }),
      });
    }
  }
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

/** Supabase insert() sends a JSON array; update() sends an object. Normalize. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function postBody(route: Route): Record<string, any> {
  const data = route.request().postDataJSON();
  if (Array.isArray(data)) return data[0] ?? {};
  return data ?? {};
}

/** Extract eq conditions from PostgREST query params (eq, and, not). */
function parseEq(url: URL): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of url.searchParams) {
    const m = value.match(/^eq\.(.*)$/);
    if (m) out[key] = m[1];
  }
  for (const item of url.searchParams.getAll("and")) {
    for (const part of item.split(",")) {
      const m = part.match(/^(\w+)=eq\.(.*)$/);
      if (m) out[m[1]] = m[2];
    }
  }
  return out;
}

function parseIn(url: URL, field: string): string[] | null {
  for (const [key, value] of url.searchParams) {
    if (key !== field) continue;
    const m = value.match(/^in\.\((.*)\)$/);
    if (m) return m[1].split(",").map((x) => x.trim());
  }
  const ands = url.searchParams.getAll("and");
  for (const item of ands) {
    const m = item.match(new RegExp(`(?:^|,)${field}=in\\.\\((.*)\\)`));
    if (m) return m[1].split(",").map((x) => x.trim());
  }
  return null;
}

function parseOr(url: URL): { field: string; value: string }[] {
  const out: { field: string; value: string }[] = [];
  const raw = url.searchParams.getAll("or");
  for (const item of raw) {
    const parts = item.split(",");
    for (const part of parts) {
      const m = part.match(/^(\w+)\.ilike\.%(.*)%$/);
      if (m) out.push({ field: m[1], value: m[2] });
    }
  }
  return out;
}

interface MockState {
  db: MockDB;
  nextCategoryId: number;
  nextVoglioId: number;
}

export function setupSupabaseMocks(
  page: Page,
  db: MockDB = defaultDB(),
  opts: {
    failLogin?: boolean;
    failSignup?: boolean;
    searchResults?: unknown[];
  } = {},
) {
  const state: MockState = { db, nextCategoryId: 100, nextVoglioId: 200 };

  const handle = async (route: Route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method();

    // Dev proxy path for edge functions (browser -> vite proxy -> supabase)
    if (path.startsWith("/api/functions/")) {
      return ok(route, { results: opts.searchResults ?? [] });
    }

    if (path.includes("/functions/v1/search-products")) {
      return ok(route, { results: opts.searchResults ?? [] });
    }

    if (path.includes("/auth/v1/token")) {
      if (opts.failLogin) {
        return ok(route, { error: "invalid_grant", error_description: "Invalid login credentials" }, 400);
      }
      return ok(route, authSessionPayload());
    }

    if (path.includes("/auth/v1/signup")) {
      if (opts.failSignup) {
        return ok(route, { error: "user_already_exists", error_description: "A user with this email address has already been registered" }, 400);
      }
      return ok(route, authSessionPayload());
    }

    if (path.includes("/auth/v1/logout")) {
      return route.fulfill({ status: 204, body: "" });
    }

    if (path.includes("/auth/v1/user")) {
      return ok(route, {
        id: TEST_USER_ID,
        aud: "authenticated",
        role: "authenticated",
        email: TEST_USER_EMAIL,
      });
    }

    if (path.includes("/storage/v1/object/")) {
      if (method === "POST" || method === "PUT") {
        return ok(route, { Key: "avatars/fake.png", id: "fake-id", fullPath: "avatars/fake.png" });
      }
      return route.fulfill({ status: 404, body: "" });
    }

    if (path.includes("/rest/v1/category")) {
      return handleCategory(route, url, method, state);
    }
    if (path.includes("/rest/v1/voglio_taken")) {
      return handleTaken(route, url, method, state);
    }
    if (path.includes("/rest/v1/voglio")) {
      return handleVoglio(route, url, method, state);
    }
    if (path.includes("/rest/v1/profiles")) {
      return handleProfiles(route, url, method, state);
    }
    if (path.includes("/rest/v1/follows")) {
      return handleFollows(route, url, method, state);
    }
    if (path.includes("/rest/v1/user_preferences")) {
      return ok(route, method === "GET" ? [] : []);
    }
    if (path.includes("/rest/v1/color_options")) {
      return ok(route, []);
    }

    // Generic PostgREST fallback
    if (path.includes("/rest/v1/")) {
      return ok(route, []);
    }

    return route.continue();
  };

  return page.route("**/*", handle);
}

function authSessionPayload() {
  return {
    access_token: makeAccessToken(),
    refresh_token: "fake-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: {
      id: TEST_USER_ID,
      aud: "authenticated",
      role: "authenticated",
      email: TEST_USER_EMAIL,
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: {},
      created_at: "2024-01-01T00:00:00.000Z",
    },
  };
}

function handleCategory(route: Route, url: URL, method: string, state: MockState) {
  const { db } = state;
  const filters = parseEq(url);
  const ids = parseIn(url, "id");
  const wantsCount = (url.searchParams.get("select") ?? "").includes("voglio(count)");

  if (method === "GET") {
    let rows = [...db.categories];
    if (filters.user_id) rows = rows.filter((r) => r.user_id === filters.user_id);
    if (filters.id) rows = rows.filter((r) => r.id === Number(filters.id));
    if (ids) rows = rows.filter((r) => ids.includes(String(r.id)));
    const result = rows.map((r) => {
      const out: Record<string, unknown> = { ...r };
      if (wantsCount) {
        out.voglio = [{ count: db.voglios.filter((v) => v.category_id === r.id).length }];
      }
      return out;
    });
    return ok(route, result);
  }

  if (method === "POST") {
    const body = postBody(route);
    const row: FakeCategory = {
      id: state.nextCategoryId++,
      name: body.name,
      description: body.description ?? "",
      emoji_code: body.emoji_code ?? "❔",
      is_private: body.is_private ?? false,
      user_id: body.user_id ?? TEST_USER_ID,
    };
    db.categories.push(row);
    return ok(route, [row], 201);
  }

  if (method === "PATCH") {
    const body = postBody(route);
    const row = db.categories.find((c) => c.id === Number(filters.id));
    if (!row) return ok(route, []);
    Object.assign(row, body);
    return ok(route, [row]);
  }

  if (method === "DELETE") {
    const id = Number(filters.id);
    const before = db.categories.length;
    db.categories = db.categories.filter((c) => c.id !== id);
    db.voglios = db.voglios.filter((v) => v.category_id !== id);
    if (db.categories.length === before) return ok(route, []);
    return ok(route, [{ id }]);
  }

  return ok(route, []);
}

function handleVoglio(route: Route, url: URL, method: string, state: MockState) {
  const { db } = state;
  const filters = parseEq(url);
  const ids = parseIn(url, "id");

  if (method === "GET") {
    let rows = [...db.voglios];
    if (filters.category_id) rows = rows.filter((r) => r.category_id === Number(filters.category_id));
    if (filters.id) rows = rows.filter((r) => r.id === Number(filters.id));
    if (ids) rows = rows.filter((r) => ids.includes(String(r.id)));
    const select = url.searchParams.get("select") ?? "";
    if (select.includes("category:category_id(")) {
      rows = rows.map((r) => ({
        ...r,
        category: db.categories.find((c) => c.id === r.category_id) ?? null,
      }));
    }
    return ok(route, rows);
  }

  if (method === "POST") {
    const body = postBody(route);
    const row: FakeVoglio = {
      id: state.nextVoglioId++,
      name: body.name,
      notes: body.notes ?? "",
      price: body.price ?? null,
      category_id: Number(body.category_id),
      reference_link: body.reference_link ?? "",
      size_id: body.size_id ?? null,
      image_url: body.image_url ?? null,
      quantity: body.quantity ?? 1,
      is_private: body.is_private ?? false,
      is_taken: false,
      user_id: body.user_id ?? TEST_USER_ID,
    };
    db.voglios.push(row);
    return ok(route, [row], 201);
  }

  if (method === "PATCH") {
    const body = postBody(route);
    const row = db.voglios.find((v) => v.id === Number(filters.id));
    if (!row) return ok(route, []);
    Object.assign(row, body);
    return ok(route, [row]);
  }

  if (method === "DELETE") {
    const id = Number(filters.id);
    db.voglios = db.voglios.filter((v) => v.id !== id);
    return ok(route, [{ id }]);
  }

  return ok(route, []);
}

function handleTaken(route: Route, url: URL, method: string, state: MockState) {
  const { db } = state;
  const filters = parseEq(url);
  const ids = parseIn(url, "voglio_id");

  if (method === "GET") {
    let rows = [...db.taken];
    if (filters.user_id) rows = rows.filter((r) => r.user_id === filters.user_id);
    if (filters.voglio_id) rows = rows.filter((r) => r.voglio_id === Number(filters.voglio_id));
    if (ids) rows = rows.filter((r) => ids.includes(String(r.voglio_id)));
    return ok(route, rows);
  }

  if (method === "POST") {
    const body = postBody(route);
    const row = { voglio_id: body.voglio_id, user_id: body.user_id, created_at: new Date().toISOString() };
    if (!db.taken.find((t) => t.voglio_id === body.voglio_id && t.user_id === body.user_id)) {
      db.taken.push(row);
    }
    return ok(route, [row], 201);
  }

  if (method === "DELETE") {
    db.taken = db.taken.filter(
      (t) => !(t.voglio_id === Number(filters.voglio_id) && t.user_id === filters.user_id),
    );
    return ok(route, []);
  }

  return ok(route, []);
}

function handleProfiles(route: Route, url: URL, method: string, state: MockState) {
  const { db } = state;
  const filters = parseEq(url);
  const ids = parseIn(url, "id");
  const ors = parseOr(url);

  if (method === "GET") {
    let rows = [...db.profiles];
    if (filters.id) rows = rows.filter((r) => r.id === filters.id);
    if (ids) rows = rows.filter((r) => ids.includes(r.id));
    if (filters.username) rows = rows.filter((r) => r.username === filters.username);
    for (const orCond of ors) {
      const value = orCond.value.toLowerCase();
      rows = rows.filter((r) => {
        const f = r[orCond.field as keyof FakeProfile];
        return typeof f === "string" && f.toLowerCase().includes(value);
      });
    }
    const limit = Number(url.searchParams.get("limit") ?? 0);
    if (limit > 0) rows = rows.slice(0, limit);
    return ok(route, rows);
  }

  if (method === "POST") {
    const body = postBody(route);
    const row: FakeProfile = {
      id: body.id,
      username: body.username,
      display_name: body.display_name ?? null,
      avatar_url: body.avatar_url ?? null,
      location: body.location ?? null,
      birth_date: body.birth_date ?? null,
      gender: body.gender ?? null,
      shirt_size: body.shirt_size ?? null,
      pants_size: body.pants_size ?? null,
      shoe_size: body.shoe_size ?? null,
      sizing_format: body.sizing_format ?? "US",
      zodiac_sign: body.zodiac_sign ?? null,
      created_at: new Date().toISOString(),
    };
    const existing = db.profiles.find((p) => p.id === row.id);
    if (existing) Object.assign(existing, row);
    else db.profiles.push(row);
    return ok(route, [row], 201);
  }

  if (method === "PATCH") {
    const body = postBody(route);
    const row = db.profiles.find((p) => p.id === filters.id);
    if (!row) return ok(route, []);
    Object.assign(row, body);
    return ok(route, [row]);
  }

  return ok(route, []);
}

function handleFollows(route: Route, url: URL, method: string, state: MockState) {
  const { db } = state;
  const filters = parseEq(url);

  if (method === "GET") {
    let rows = [...db.follows];
    if (filters.follower_id) rows = rows.filter((r) => r.follower_id === filters.follower_id);
    if (filters.following_id) rows = rows.filter((r) => r.following_id === filters.following_id);
    return ok(route, rows);
  }

  if (method === "POST") {
    const body = postBody(route);
    const row = { follower_id: body.follower_id, following_id: body.following_id };
    if (!db.follows.find((f) => f.follower_id === row.follower_id && f.following_id === row.following_id)) {
      db.follows.push(row);
    }
    return ok(route, [row], 201);
  }

  if (method === "DELETE") {
    db.follows = db.follows.filter(
      (f) => !(f.follower_id === filters.follower_id && f.following_id === filters.following_id),
    );
    return ok(route, []);
  }

  return ok(route, []);
}
