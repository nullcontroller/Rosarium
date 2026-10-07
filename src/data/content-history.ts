import { recentGrowth, growthChangeTargets, growthChangeText } from "./recent-growth.ts";

export interface HistoryEvent {
  date: string | null;
  type: "published" | "revised";
  text?: string;
}
interface PublicationData {
  published_at?: string | null;
  source?: { published_at?: string | null; publication_month?: string | null };
}

/** Only curated, reader-facing changes; file timestamps are not publication dates. */
export function contentHistory(id: string, data: PublicationData): HistoryEvent[] {
  const changes = recentGrowth.flatMap(entry => entry.changes.flatMap(change => {
    if (!growthChangeTargets(change).includes(id)) return [];
    const text = growthChangeText(change);
    const type = typeof change === "string" ? undefined : change.action;
    if (!type) return [];
    return [{ date: entry.date, type, text: text.replace(/^(?:新規公開|改訂)。\s*/, "") }];
  }));
  const recordedPublication = changes.find(event => event.type === "published");
  const rawDate = data.published_at ?? data.source?.published_at ?? data.source?.publication_month;
  const date = rawDate?.match(/^\d{4}-\d{2}(?:-\d{2})?/)?.[0] ?? recordedPublication?.date ?? null;
  // Publication is always the first event in chronological storage. Unknown dates
  // remain unknown; updated_at/last_updated and Git import dates cannot fill them.
  return [
    { date, type: "published", text: recordedPublication?.text },
    ...changes.filter(event => event.type === "revised").sort((a, b) => a.date.localeCompare(b.date)),
  ];
}
