// Shared logic for the "Real or AI?" classroom replication of Hove et al. (2026).
// Used by index.html (task) and results.html (projector). Also runs under Node for testing.
(function (root) {
  "use strict";

  // ---- measures (as in the paper) -------------------------------------------------
  // Brier score for one rating: squared distance between rating/100 and the truth (1 = AI, 0 = authentic)
  const brier = (score, ai) => Math.pow(score / 100 - ai, 2);
  // Confidence as in the paper: distance from the midpoint 50, rescaled to 0-100
  const confidence = (score) => Math.abs(score - 50) * 2;
  const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
  const sd = (a) => {
    if (a.length < 2) return NaN;
    const m = mean(a);
    return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1));
  };

  // ---- drawing seven images -------------------------------------------------------
  // Paper: 7 images from a pool of 52 (26 events x authentic/AI); never the same event twice; random order.
  // The replication data show the two versions of an event were not drawn equally often, so we use the
  // paper's empirical share of AI versions for each event as the probability of showing the AI version.
  function pairShares(bench) {
    const s = {};
    for (const r of bench.per_image) {
      s[r.pair] = s[r.pair] || { ai: 0, real: 0 };
      if (r.ai === 1) s[r.pair].ai = r.n; else s[r.pair].real = r.n;
    }
    const out = {};
    for (const k in s) out[k] = s[k].ai / (s[k].ai + s[k].real);
    return out;
  }

  function shuffle(a, rng) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  function drawSeven(manifest, bench, rng) {
    rng = rng || Math.random;
    const shares = pairShares(bench);
    const pairs = shuffle([...new Set(manifest.map((m) => m.pair))], rng).slice(0, 7);
    return pairs.map((p) => {
      const wantAI = rng() < (shares[p] != null ? shares[p] : 0.5) ? 1 : 0;
      return manifest.find((m) => m.pair === p && m.ai === wantAI);
    });
  }

  // ---- aggregation for the projector page ------------------------------------------
  // rows: [{session, image_id, score, task, seconds}] as stored; manifest supplies the truth.
  function enrich(rows, manifest) {
    const byId = Object.fromEntries(manifest.map((m) => [m.id, m]));
    return rows
      .filter((r) => byId[r.image_id] && Number.isFinite(+r.score))
      .map((r) => {
        const m = byId[r.image_id];
        const score = +r.score;
        return {
          session: r.session, image_id: r.image_id, pair: m.pair, category: m.category, ai: m.ai,
          score, seconds: +r.seconds, brier: brier(score, m.ai), conf: confidence(score),
        };
      });
  }

  function byRespondent(items) {
    const g = {};
    for (const it of items) (g[it.session] = g[it.session] || []).push(it);
    return Object.entries(g).map(([session, its]) => ({
      session, n: its.length, brier: mean(its.map((i) => i.brier)), conf: mean(its.map((i) => i.conf)),
    }));
  }

  // Cluster bootstrap over respondents (items within a respondent are resampled together)
  function bootstrapCI(items, stat, B, rng) {
    rng = rng || Math.random;
    const g = {};
    for (const it of items) (g[it.session] = g[it.session] || []).push(it);
    const ids = Object.keys(g);
    if (ids.length < 3) return [NaN, NaN];
    const est = [];
    for (let b = 0; b < B; b++) {
      let sample = [];
      for (let i = 0; i < ids.length; i++) sample = sample.concat(g[ids[Math.floor(rng() * ids.length)]]);
      const v = stat(sample);
      if (Number.isFinite(v)) est.push(v);
    }
    est.sort((a, b) => a - b);
    if (est.length < 20) return [NaN, NaN];
    return [est[Math.floor(0.025 * est.length)], est[Math.ceil(0.975 * est.length) - 1]];
  }

  const api = { brier, confidence, mean, sd, pairShares, shuffle, drawSeven, enrich, byRespondent, bootstrapCI };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.RA = api;
})(typeof window !== "undefined" ? window : globalThis);
