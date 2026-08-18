import { logoDataUrl } from "./lib/logo";

function addLink(rel: string, attrs: Record<string, string>) {
  const link = document.createElement("link");
  link.rel = rel;
  for (const [k, v] of Object.entries(attrs)) link.setAttribute(k, v);
  document.head.appendChild(link);
}

/**
 * Registers Clipstash as an installable PWA at runtime. Icons and manifest are
 * embedded as data-URI / blob URLs so everything works from a single
 * index.html with no external assets.
 */
export function setupPWA() {
  if (typeof document === "undefined") return;
  const icon = logoDataUrl();

  addLink("icon", { type: "image/svg+xml", href: icon });
  addLink("apple-touch-icon", { href: icon });
  addLink("mask-icon", { href: icon, color: "#2563eb" });

  const scope = new URL(".", window.location.href).href;
  const manifest = {
    name: "Clipstash",
    short_name: "Clipstash",
    description:
      "Clipstash — a smart clipboard manager. Capture, organize and re-copy anything in one tap.",
    start_url: window.location.href,
    scope,
    display: "standalone",
    orientation: "portrait",
    background_color: "#05060a",
    theme_color: "#0a1430",
    icons: [
      { src: icon, sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: icon, sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: icon, sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };

  const blob = new Blob([JSON.stringify(manifest)], {
    type: "application/manifest+json",
  });
  addLink("manifest", { href: URL.createObjectURL(blob) });
}
