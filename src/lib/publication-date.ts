// Operational date, never a claim about the historical publication date.
export const unknownPublicationDate = "2026-09-23";
export interface PublicationDateData {
  published_at?: string | null;
  publication_date_basis?: "fallback";
  source?: { published_at?: string | null; publication_month?: string | null };
}
export function publicationDate(data: PublicationDateData, recordedDate?: string): string {
  const confirmed = data.publication_date_basis === "fallback" ? undefined : data.published_at;
  const raw = confirmed ?? data.source?.published_at ?? data.source?.publication_month ?? recordedDate;
  return raw?.match(/^\d{4}-\d{2}(?:-\d{2})?/)?.[0] ?? unknownPublicationDate;
}
