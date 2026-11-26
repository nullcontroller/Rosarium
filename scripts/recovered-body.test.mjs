import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { verifyRecoveredBody } from "./recovered-body.mjs";
const digest = body => crypto.createHash("sha256").update(body).digest("hex");
const original = "Original recovered text\n";
const marker = "\n<!-- dated-local-appendix -->\n";
const addition = marker + "An explicitly approved revision\n";
const record = { destination: "essays/example", destination_body_sha256: digest(original), local_appendix: {
  date: "2026-10-06", marker, sha256: digest(addition), reason: "Approved content integration",
} };
test("dated appendix keeps the immutable original and verifies both content segments", () => {
  verifyRecoveredBody(original + addition, record, "2026-10-06");
  verifyRecoveredBody(original, { ...record, local_appendix: undefined }, "2026-10-05");
});
test("original and appendix tampering remain errors", () => {
  assert.throws(() => verifyRecoveredBody("Changed original\n" + addition, record, "2026-10-06"));
  assert.throws(() => verifyRecoveredBody(original + addition + "unrecorded text", record, "2026-10-06"));
  assert.throws(() => verifyRecoveredBody(original + "unrecorded text", { ...record, local_appendix: undefined }, "2026-10-06"));
});
test("appendices require matching date, unique marker and a recorded reason", () => {
  assert.throws(() => verifyRecoveredBody(original + addition, record, "2026-10-05"));
  assert.throws(() => verifyRecoveredBody(original, record, "2026-10-06"));
  assert.throws(() => verifyRecoveredBody(original + addition + addition, record, "2026-10-06"));
  assert.throws(() => verifyRecoveredBody(original + addition, { ...record, local_appendix: { ...record.local_appendix, reason: "" } }, "2026-10-06"));
});
test('recorded wrap corrections preserve original checksum protection', () => {
 const old='First.  \nSecond.\n', next='First.\nSecond.\n';
 const presentation={destination:'example',destination_body_sha256:digest(old),presentation_revision:{date:'2026-11-25',reason:'Natural wrapping',breaks:[{offset:6,original:'  \n'}]}};
 verifyRecoveredBody(next,presentation,'2026-10-19');
 assert.throws(()=>verifyRecoveredBody(next.replace('Second','Changed'),presentation,'2026-10-19'));
});

test('approved title references are reversible without weakening recovered body checksums', () => {
 const source='## Old title\nOriginal text\n';
 const renamed='## New title\nOriginal text\n';
 const record={destination:'example',destination_body_sha256:digest(source),title_revision:{date:'2026-11-27',previous_last_updated:'2026-10-05',reason:'Approved title synchronization',references:[{original:'## Old title',replacement:'## New title'}]}};
 verifyRecoveredBody(renamed,record,'2026-11-27');
 assert.throws(()=>verifyRecoveredBody(renamed.replace('Original','Changed'),record,'2026-11-27'));
 assert.throws(()=>verifyRecoveredBody(renamed,record,'2026-11-26'));
});
