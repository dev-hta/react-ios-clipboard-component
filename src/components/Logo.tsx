import { logoDataUrl } from "../lib/logo";

export default function Logo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={logoDataUrl()}
      alt="Clipstash logo"
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
