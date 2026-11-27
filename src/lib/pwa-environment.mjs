/** One build-time source for app identity. Unknown/conflicting modes fail closed. */
export function pwaEnvironment(env = process.env) {
  const expected = env.ROSARIUM_DRAFT_PREVIEW ? 'staging' : 'production';
  const mode = env.ROSARIUM_PWA_ENV ?? expected;
  if (!['production', 'staging'].includes(mode) || mode !== expected)
    throw new Error('PWA environment is unknown or conflicts with the review output');
  const staging = mode === 'staging';
  const origin = staging ? 'https://nullcontroller.tail8bbb3b.ts.net:8450' : 'https://rosarium-tech.com';
  return {
    mode, staging, origin,
    name: staging ? 'Rosarium Staging' : 'Rosarium',
    shortName: staging ? 'Rosarium STG' : 'Rosarium',
    // Keep the old Review app's effective ID when changing its displayed name.
    id: origin + (staging ? '/?app=rosarium-review' : '/'),
    startUrl: origin + '/',
    scope: origin + '/',
    color: staging ? '#96651C' : '#17383b',
    icons: staging ? '/icons/staging/' : '/icons/',
    favicon: staging ? '/icons/staging/favicon.svg' : '/favicon.svg',
    worker: staging ? '/sw-staging.js' : '/sw.js',
    cachePrefix: `rosarium-pwa-${mode}-`,
  };
}

export function pwaManifest(environment, description) {
  return {
    name: environment.name, short_name: environment.shortName,
    id: environment.id, lang: 'ja', description,
    start_url: environment.startUrl, scope: environment.scope,
    display: 'standalone', background_color: environment.color, theme_color: environment.color,
    icons: [
      ['icon-192.png', '192x192', 'any'], ['icon-512.png', '512x512', 'any'],
      ['icon-maskable-192.png', '192x192', 'maskable'], ['icon-maskable-512.png', '512x512', 'maskable'],
    ].map(([file, sizes, purpose]) => ({ src: environment.icons + file, sizes, type: 'image/png', purpose })),
  };
}
