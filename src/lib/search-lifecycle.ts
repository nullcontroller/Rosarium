export const searchLifecycles = ["active", "obsolete", "retired"] as const;
export type SearchLifecycle = typeof searchLifecycles[number];
export const defaultSearchLifecycles: SearchLifecycle[] = ["active", "obsolete"];
export const parseSearchLifecycles = (value: string | null): SearchLifecycle[] =>
  value === null ? [...defaultSearchLifecycles] : searchLifecycles.filter((status) => value.split(",").includes(status));
// Pagefind arrays are AND by default; lifecycle choices must be combined with OR.
export const lifecycleSearchOptions = (selected: SearchLifecycle[]) => ({
  filters: { lifecycle: { any: selected } },
});
