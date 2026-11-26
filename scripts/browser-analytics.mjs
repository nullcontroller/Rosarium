import fs from 'node:fs';

const measurementId = fs.readFileSync(new URL('../src/components/GoogleAnalytics.astro', import.meta.url), 'utf8').match(/const measurementId = "(G-[A-Z0-9]+)";/)?.[1];
if (!measurementId) throw new Error('Missing GA4 measurement ID');

// Install on a fresh context BEFORE creating pages or navigating, including production QA.
export async function blockAnalytics(context) {
  await context.route(/^https?:\/\/(?:[^/]+\.)?(?:google-analytics\.com|googletagmanager\.com|analytics\.google\.com|stats\.g\.doubleclick\.net)(?::\d+)?\//i, route => route.abort());
  await context.addInitScript(id => {
    window[`ga-disable-${id}`] = true;
    try { localStorage.setItem('rosarium.analytics.disabled', '1'); } catch {}
  }, measurementId);
}
