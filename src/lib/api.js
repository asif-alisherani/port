/**
 * Thin client for the Laravel backend.
 *
 * `VITE_API_URL` points at the Laravel API (e.g. http://localhost:8000/api).
 * When it is unset or unreachable every call fails softly, and the UI keeps
 * using its bundled fallback content.
 */
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const hasApi = Boolean(API_URL);

/** GET /content — returns null on any failure. */
export async function fetchContent(signal) {
  if (!hasApi) return null;
  try {
    const res = await fetch(`${API_URL}/content`, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * POST /contact
 * @returns {{ ok: boolean, errors?: Record<string,string[]>, offline?: boolean }}
 */
export async function sendContact(payload) {
  if (!hasApi) return { ok: false, offline: true };
  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, errors: body.errors ?? {} };
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return { ok: true };
  } catch {
    return { ok: false, offline: true };
  }
}
