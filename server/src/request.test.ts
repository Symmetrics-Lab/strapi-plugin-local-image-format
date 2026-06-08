// ABOUTME: Unit tests for the pure request-parsing and dimension-guard helpers
// ABOUTME: that protect the image middleware from path confusion and resize DoS.

import { describe, expect, it } from "vitest";
import { exceedsMaxDimension, stripMountPath } from "./request";

describe("stripMountPath", () => {
  it("strips the mount path prefix and keeps the remainder", () => {
    expect(stripMountPath("/uploads/w_100/test.png", ["/uploads"])).toBe(
      "/w_100/test.png"
    );
  });

  it("preserves the query string", () => {
    expect(stripMountPath("/uploads/test.png?w=100", ["/uploads"])).toBe(
      "/test.png?w=100"
    );
  });

  it("matches the exact mount path with no trailing segment", () => {
    expect(stripMountPath("/uploads", ["/uploads"])).toBe("");
  });

  it("returns null when no configured path is a prefix", () => {
    expect(stripMountPath("/api/articles", ["/uploads"])).toBeNull();
  });

  it("does not match the target as a mid-URL substring", () => {
    // Would be a false positive under the previous includes()-based logic.
    expect(stripMountPath("/api/redirect?to=/uploads/x.png", ["/uploads"])).toBeNull();
  });

  it("does not match a sibling path with a shared prefix", () => {
    expect(stripMountPath("/uploads-private/x.png", ["/uploads"])).toBeNull();
  });

  it("checks every configured path", () => {
    expect(stripMountPath("/media/x.png", ["/uploads", "/media"])).toBe("/x.png");
  });

  it("returns null for an undefined url", () => {
    expect(stripMountPath(undefined, ["/uploads"])).toBeNull();
  });
});

describe("exceedsMaxDimension", () => {
  it("flags width over the limit", () => {
    expect(exceedsMaxDimension({ w: "30000" }, 4000)).toBe(true);
  });

  it("flags height over the limit", () => {
    expect(exceedsMaxDimension({ height: "8000" }, 4000)).toBe(true);
  });

  it("allows dimensions within the limit", () => {
    expect(exceedsMaxDimension({ w: "100", h: "200" }, 4000)).toBe(false);
  });

  it("allows the boundary value", () => {
    expect(exceedsMaxDimension({ w: "4000" }, 4000)).toBe(false);
  });

  it("parses WxH size shorthand", () => {
    expect(exceedsMaxDimension({ s: "9000x9000" }, 4000)).toBe(true);
  });

  it("ignores non-dimension modifiers", () => {
    expect(exceedsMaxDimension({ f: "webp", q: "80" }, 4000)).toBe(false);
  });

  it("ignores non-numeric dimension values", () => {
    expect(exceedsMaxDimension({ w: "auto" }, 4000)).toBe(false);
  });

  it("returns false for no modifiers", () => {
    expect(exceedsMaxDimension({}, 4000)).toBe(false);
  });
});
