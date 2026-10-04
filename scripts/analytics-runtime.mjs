import vm from "node:vm";

// Execute the actual initialization script without contacting Google.
export function runAnalytics(script, overrides = {}) {
  const loaders = [];
  const window = {
    location: {
      hostname: "nullcontroller.github.io",
      protocol: "https:",
      pathname: "/Rosarium/",
      ...overrides.location,
    },
  };
  const context = {
    window,
    navigator: { webdriver: false, userAgent: "Mozilla/5.0 Chrome/140.0 Safari/537.36", ...overrides.navigator },
    measurementId: "G-W5ZR0NKWGB",
    document: { createElement: () => ({}), head: { appendChild: (loader) => loaders.push(loader) } },
  };
  vm.runInNewContext(script, context, { timeout: 1000 });
  return { loaders, events: window.dataLayer ?? [], initialized: typeof window.gtag === "function" };
}
