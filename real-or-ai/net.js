// Tiny client for the Google Apps Script endpoint (see apps-script/Code.gs).
// POST uses text/plain so the browser sends no CORS preflight. All writes are idempotent on the server
// (duplicates are ignored), so a failed attempt can safely be retried.
(function () {
  "use strict";
  const cfg = window.RA_CONFIG || {};

  async function post(payload) {
    if (!cfg.ENDPOINT) return { ok: true, demo: true };
    const body = JSON.stringify(payload);
    try {
      const r = await fetch(cfg.ENDPOINT, {
        method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body,
      });
      return await r.json();
    } catch (e) {
      // Some browsers block reading the redirected response. Retry once without reading it:
      // the server ignores duplicates, so this is safe.
      await fetch(cfg.ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body });
      return { ok: true, unconfirmed: true };
    }
  }

  async function get(params) {
    if (!cfg.ENDPOINT) return null;
    const q = new URLSearchParams(params).toString();
    const r = await fetch(cfg.ENDPOINT + "?" + q);
    return await r.json();
  }

  window.RA_NET = { post, get };
})();
