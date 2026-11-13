/** Explicitly selected, nonpublic drafts only; ordinary builds never opt in. */
export function isDraftPreview(
  /** @type {{id: string, data: {status: string, public?: boolean}}} */ entry,
  selectedIds = "",
) {
  return entry.data.status === "draft" && entry.data.public === false &&
    selectedIds.split(",").map(id => id.trim()).filter(Boolean).includes(entry.id);
}
