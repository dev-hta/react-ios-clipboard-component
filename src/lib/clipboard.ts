import type { Clip, ClipType } from "../types";

const STORAGE_KEY = "ios27-clipboard-v1";

/** Detect what kind of content a string holds. */
export function detectType(raw: string): ClipType {
  const s = raw.trim();
  if (!s) return "text";

  // hex color like #fff or #1a2b3c
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s)) return "color";

  // email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "email";

  // url
  if (/^(https?:\/\/|www\.)[^\s]+$/i.test(s)) return "link";

  // phone number (digits, spaces, dashes, parens, plus)
  const digits = s.replace(/[^\d]/g, "");
  if (
    !/[a-zA-Z]/.test(s) &&
    /[\d\+\(\)]/.test(s) &&
    digits.length >= 7 &&
    digits.length <= 15
  ) {
    return "phone";
  }

  // short numeric pin / OTP
  if (/^\d{3,8}$/.test(s)) return "code";

  // short alphanumeric code (e.g. A1B2-CD)
  if (/^[A-Z0-9][A-Z0-9\-]{2,11}$/.test(s.toUpperCase()) && /\d/.test(s)) return "code";

  return "text";
}

const UNITS: [number, string][] = [
  [60, "s"],
  [60, "m"],
  [24, "h"],
  [7, "d"],
];

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";

  let value = s;
  let unit = "s";
  for (const [div, u] of UNITS) {
    if (value < div) break;
    value = Math.floor(value / div);
    unit = u;
  }
  if (unit === "d" && value >= 7) {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return `${value}${unit} ago`;
}

export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
  );
}

export function loadClips(): Clip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedClips();
    const parsed = JSON.parse(raw) as Clip[];
    if (!Array.isArray(parsed)) return seedClips();
    return parsed;
  } catch {
    return seedClips();
  }
}

export function saveClips(clips: Clip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clips));
  } catch {
    /* ignore quota / privacy mode errors */
  }
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const now = Date.now();

function seedClips(): Clip[] {
  const make = (
    content: string,
    age: number,
    copiedCount = 1,
    pinned = false,
  ): Clip => {
    const ts = now - age;
    return {
      id: uid(),
      content,
      type: detectType(content),
      createdAt: ts,
      lastUsed: ts,
      copiedCount,
      pinned,
    };
  };

  return [
    make("829104", 2 * MIN, 4, true),
    make("https://www.apple.com/ios/ios-27", 25 * MIN, 2, true),
    make("kiera.design@studio.co", 3 * HOUR),
    make("#5E5CE6", 1 * DAY, 3),
    make("The best time to plant a tree was 20 years ago. The second best time is now.", 2 * DAY),
    make("+1 (415) 555-0147", 4 * DAY),
    make("GHX7-9KQ2-MP4D", 5 * DAY),
    make("Two-factor backup codes are stored offline only.", 6 * DAY),
  ];
}
