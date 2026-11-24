import type { Entry } from "./navigation";

export const updateLabels = {
  new: "NEW",
  updated: "UPDATED",
  expanded: "EXPANDED",
  revised: "REVISED",
  connected: "CONNECTED",
  reframed: "REFRAMED",
} as const;

export type UpdateType = keyof typeof updateLabels;

export const activityDate = (entry: Entry) =>
  entry.data.last_updated ?? entry.data.published_at?.slice(0, 10);

export const updateType = (entry: Entry): UpdateType =>
  entry.data.update_type ??
  (entry.data.published_at && entry.data.last_updated > entry.data.published_at.slice(0, 10)
    ? "updated" : "new");
