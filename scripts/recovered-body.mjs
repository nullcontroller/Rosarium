import assert from "node:assert/strict";
import crypto from "node:crypto";
const digest = (body) => crypto.createHash("sha256").update(body).digest("hex");
// A local appendix never replaces the immutable recovered text or its import checksum.
export function verifyRecoveredBody(body, record, lastUpdated) {
  const titleRevision = record.title_revision;
  if (titleRevision) {
    assert.equal(lastUpdated, titleRevision.date);
    assert.ok(titleRevision.reason?.trim());
    for (const { original, replacement } of titleRevision.references) {
      assert.equal(body.split(replacement).length - 1, 1, "Title reference must be unique");
      body = body.replace(replacement, original);
    }
  }
  const appendix = record.local_appendix;
  const presentation = record.presentation_revision;
  if (presentation) {
    assert.match(presentation.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(presentation.reason?.trim());
    // Restore only recorded Markdown break markers, then verify the original checksums.
    for (const entry of presentation.breaks.toReversed()) {
      assert.match(entry.original, /^(?: {2,}|\\)\n$/);
      assert.equal(body[entry.offset], "\n");
      body = body.slice(0, entry.offset) + entry.original + body.slice(entry.offset + 1);
    }
  }
  if (!appendix) {
    assert.equal(digest(body), record.destination_body_sha256, "Recovered body changed: " + record.destination);
    return;
  }
  assert.match(appendix.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(titleRevision ? titleRevision.previous_last_updated : lastUpdated, appendix.date);
  assert.ok(appendix.reason?.trim(), "Appendix reason missing");
  assert.ok(appendix.marker?.trim(), "Appendix marker missing");
  const boundary = body.indexOf(appendix.marker);
  assert.ok(boundary > 0, "Appendix marker missing from body");
  assert.equal(body.indexOf(appendix.marker, boundary + appendix.marker.length), -1, "Duplicate appendix marker");
  assert.equal(digest(body.slice(0, boundary)), record.destination_body_sha256, "Recovered original changed: " + record.destination);
  assert.equal(digest(body.slice(boundary)), appendix.sha256, "Local appendix changed: " + record.destination);
}
