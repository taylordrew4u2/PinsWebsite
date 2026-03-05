import { createHash, timingSafeEqual } from "crypto";

// In-memory rate limit store: key = IP hash, value = { count, resetAt }
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function checkRateLimit(ipHash: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ipHash);

  if (!entry || now > entry.resetAt) {
    store.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

function hashForCompare(value: string): Buffer {
  return Buffer.from(createHash("sha256").update(value).digest());
}

export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "weed";
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
    console.warn("[admin] WARNING: ADMIN_PASSWORD env var is not set. Using insecure default.");
  }
  // Hash both values to fixed-length buffers so timingSafeEqual reveals no length information
  const a = hashForCompare(submitted);
  const b = hashForCompare(expected);
  return timingSafeEqual(a, b);
}

