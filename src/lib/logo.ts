/** The Clipstash brand mark as a raw SVG string (shared by the UI + PWA icons). */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="lbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#60a5fa"/>
      <stop offset="0.55" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="116" fill="url(#lbg)"/>
  <rect x="132" y="158" width="248" height="244" rx="40" fill="#ffffff" opacity="0.16"/>
  <rect x="176" y="240" width="160" height="22" rx="11" fill="#ffffff"/>
  <rect x="176" y="286" width="120" height="22" rx="11" fill="#ffffff" opacity="0.85"/>
  <rect x="176" y="332" width="146" height="22" rx="11" fill="#ffffff" opacity="0.7"/>
  <rect x="206" y="120" width="100" height="62" rx="22" fill="#ffffff"/>
  <rect x="234" y="138" width="44" height="26" rx="13" fill="#1d4ed8"/>
</svg>`;

/** URL-safe data URI of the logo, safe to use in <img>, favicon and manifest. */
export function logoDataUrl(): string {
  return "data:image/svg+xml," + encodeURIComponent(LOGO_SVG);
}
