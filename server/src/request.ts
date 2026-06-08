// ABOUTME: Pure helpers for parsing incoming image-request URLs and guarding
// ABOUTME: user-controlled modifiers (e.g. resize dimensions) before hitting ipx.

// Modifier keys that carry a pixel dimension and therefore drive how much memory
// sharp allocates. `s`/`size` are "WxH" shorthands (e.g. "s_800x600").
const DIMENSION_KEYS = ["w", "width", "h", "height"] as const;
const SIZE_KEYS = ["s", "size"] as const;

/**
 * Strip the matched mount path (e.g. "/uploads") off the request URL and return
 * the remainder (modifiers + id + query). Returns null when no configured path
 * is a prefix of the URL.
 *
 * Uses a prefix match instead of substring matching so a target string appearing
 * mid-URL or inside a filename cannot be mistaken for the mount point.
 */
export function stripMountPath(
  reqUrl: string | undefined,
  paths: string[]
): string | null {
  if (!reqUrl) return null;
  for (const target of paths) {
    if (reqUrl === target || reqUrl.startsWith(`${target}/`)) {
      return reqUrl.slice(target.length);
    }
  }
  return null;
}

/**
 * True when any numeric resize dimension exceeds `max`. Non-numeric or absent
 * modifiers are ignored so non-dimension modifiers (format, quality, etc.) pass
 * through untouched. Used to reject oversized requests that would otherwise let
 * sharp allocate an unbounded canvas (memory-exhaustion DoS).
 */
export function exceedsMaxDimension(
  modifiers: Record<string, unknown>,
  max: number
): boolean {
  const dims: number[] = [];

  for (const key of DIMENSION_KEYS) {
    if (modifiers[key] != null) dims.push(Number(modifiers[key]));
  }

  for (const key of SIZE_KEYS) {
    const value = modifiers[key];
    if (typeof value === "string") {
      for (const part of value.split("x")) dims.push(Number(part));
    }
  }

  return dims.some((n) => Number.isFinite(n) && n > max);
}
