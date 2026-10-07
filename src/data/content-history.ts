import { recentGrowth, growthChangeTargets, growthChangeText } from "./recent-growth.ts";

export interface HistoryEvent {
  date: string | null;
  type: "published" | "revised" | "integrated" | "retired";
  text?: string;
}
interface PublicationData {
  layer?: string;
  updated_at?: string | null;
  last_updated?: string;
  update_note?: string;
  published_at?: string | null;
  source?: { published_at?: string | null; publication_month?: string | null };
}

// Operational publication date specified for entries whose original date is unknown.
export const unknownPublicationDate = "2026-09-23";

/** Only curated, reader-facing changes; file timestamps are not publication dates. */
export function contentHistory(id: string, data: PublicationData): HistoryEvent[] {
  const changes = recentGrowth.flatMap(entry => entry.changes.flatMap(change => {
    if (!growthChangeTargets(change).includes(id)) return [];
    const text = growthChangeText(change);
    const type = typeof change === "string" ? undefined : change.action;
    if (!type) return [];
    return [{ date: entry.date, type, text: text.replace(/^(?:新規公開|改訂|統合|退役)。\s*/, "") }];
  }));
  const recordedPublication = changes.find(event => event.type === "published");
  const noteDate = (data.updated_at ?? data.last_updated)?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (data.update_note && noteDate) {
    const existing = changes.find(event => event.date === noteDate && event.type === "revised");
    if (existing) {
      if (!existing.text.includes(data.update_note)) existing.text += "\n" + data.update_note;
    } else changes.push({ date: noteDate, type: "revised", text: data.update_note });
  }
  const rawDate = data.published_at ?? data.source?.published_at ?? data.source?.publication_month;
  const date = rawDate?.match(/^\d{4}-\d{2}(?:-\d{2})?/)?.[0] ?? recordedPublication?.date ?? (data.layer === "career" ? null : unknownPublicationDate);
  // Verified dates/months take precedence. The fallback is an explicit operating
  // convention, never a date inferred from updated_at or an import commit.
  return [
    { date, type: "published", text: recordedPublication?.text },
    ...changes.filter(event => event.type !== "published").sort((a, b) => a.date.localeCompare(b.date)),
  ];
}
