/** Select actual first publications, independently of revision/history events.
 * Callers additionally exclude compatibility URLs using the site's publicEntry guard.
 * @template {{ id: string, data: { published_at?: string | null, publication_date_basis?: string, status?: string, public?: boolean, lifecycle?: string, series?: string, order?: number } }} T
 * @param {string} date
 * @param {T[]} contents
 * @returns {T[]}
 */
export function newPublications(date, contents) {
  const seen = new Set();
  return contents.filter(({ id, data }) => {
    if (seen.has(id) || data.status === 'draft' || data.public === false ||
        (data.lifecycle && data.lifecycle !== 'active') ||
        data.publication_date_basis === 'fallback' || data.published_at?.slice(0, 10) !== date ||
        (data.series && data.order !== 0)) return false;
    seen.add(id);
    return true;
  });
}

