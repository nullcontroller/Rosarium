import vm from "node:vm";

// Execute the actual initialization script without contacting Google.
export function runAnalytics(script, overrides = {}) {
  const loaders = [];
  const storage = new Map(Object.entries(overrides.storage ?? {}));
  const window = {
    ...(overrides.disabled ? { 'ga-disable-G-W5ZR0NKWGB': true } : {}),
    localStorage: {
      getItem(key) { if (overrides.storageError) throw new Error('Storage unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (overrides.storageError) throw new Error('Storage unavailable'); storage.set(key, value); },
    },
    location: {
      hostname: "rosarium-tech.com",
      protocol: "https:",
      pathname: "/",
      search: "",
      ...overrides.location,
    },
  };
  const context = {
    window,
    navigator: { webdriver: false, userAgent: "Mozilla/5.0 Chrome/140.0 Safari/537.36", ...overrides.navigator },
    measurementId: "G-W5ZR0NKWGB",
    page: { page_title: "Rosarium", page_path: "/", content_type: "home", primary_category: "home" },
    enabled: overrides.enabled ?? true,
    URL,
    URLSearchParams,
    document: { referrer: overrides.referrer ?? "", createElement: () => ({}), head: { appendChild: (loader) => loaders.push(loader) } },
  };
  vm.runInNewContext(script, context, { timeout: 1000 });
  return { loaders, events: window.dataLayer ?? [], initialized: typeof window.gtag === "function", disabled: window["ga-disable-G-W5ZR0NKWGB"] === true, storage: Object.fromEntries(storage) };
}
