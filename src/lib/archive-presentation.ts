/** Display an existing reason's first sentence without inventing a new summary. */
export const archiveReason = (reason?: string) => reason?.match(/^[\s\S]*?[。！？]/)?.[0].trim() || reason || "";

/** Read the literal target from the existing compatibility route, never infer from its title. */
export const archiveDestination = (routeSource: string) =>
  routeSource.match(/const destination\s*=\s*url\(["']([a-z0-9/-]+)["']\)\s*;/)?.[1];
