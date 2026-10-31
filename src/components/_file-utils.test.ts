import { describe, expect, it } from "vitest";

import { isSafeUrl, matchesAccept } from "./_file-utils";

describe("isSafeUrl", () => {
  it("allows relative and allow-listed absolute URLs", () => {
    expect(isSafeUrl("/files/a.pdf")).toBe(true);
    expect(isSafeUrl("https://example.com/a.png")).toBe(true);
    expect(isSafeUrl("blob:https://example.com/id")).toBe(true);
    expect(isSafeUrl("data:image/png;base64,AAAA")).toBe(true);
    expect(isSafeUrl("tel:+15551234")).toBe(true);
  });

  it("rejects executable schemes, including obfuscated ones", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("  JaVaScRiPt:alert(1)")).toBe(false);
    expect(isSafeUrl("java\tscript:alert(1)")).toBe(false);
    expect(isSafeUrl("vbscript:msgbox(1)")).toBe(false);
  });
});

describe("matchesAccept", () => {
  const png = { name: "photo.PNG", type: "image/png" };
  const pdf = { name: "doc.pdf", type: "application/pdf" };

  it("accepts everything for an empty list", () => {
    expect(matchesAccept(png, "")).toBe(true);
  });

  it("matches MIME wildcards, exact MIME types and extensions", () => {
    expect(matchesAccept(png, "image/*")).toBe(true);
    expect(matchesAccept(png, "image/jpeg,image/png")).toBe(true);
    expect(matchesAccept(pdf, ".pdf")).toBe(true);
    expect(matchesAccept(pdf, "image/*,.png")).toBe(false);
  });
});
