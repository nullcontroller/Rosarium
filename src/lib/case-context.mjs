/** Existing evidence registry and explicit article metadata are the sources of case context. */
export function caseContext(entry, businessStudies = []) {
  if (entry.data.section !== "cases" || entry.data.kind !== "case") return undefined;
  return entry.data.case_context ?? (businessStudies.some(study =>
    entry.id === study.book || entry.id.startsWith(study.book + "/")) ? "business" : undefined);
}

export function independentCases(entries, context, businessStudies = []) {
  return entries.filter(entry => caseContext(entry, businessStudies) === context &&
    (!entry.data.series || entry.data.order === 0) && !businessStudies.some(study => study.book === entry.id))
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0) || a.id.localeCompare(b.id));
}
