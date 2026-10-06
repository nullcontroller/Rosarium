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
