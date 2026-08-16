import { useState } from "react";
import { motion } from "framer-motion";
import { Pin, PinOff, Trash2, Check, Copy } from "lucide-react";
import type { Clip } from "../types";
import { TYPE_META } from "../lib/meta";
import { timeAgo } from "../lib/clipboard";

interface ClipCardProps {
  clip: Clip;
  onCopy: (clip: Clip) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

function isLight(hex: string) {
  const c = hex.replace("#", "");
  const full =
    c.length === 3
      ? c
          .split("")
          .map((x) => x + x)
          .join("")
      : c.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export default function ClipCard({
  clip,
  onCopy,
  onTogglePin,
  onDelete,
}: ClipCardProps) {
  const meta = TYPE_META[clip.type];
  const [copied, setCopied] = useState(false);
  const Icon = meta.Icon;

  const isColor = clip.type === "color";

  const handleCopy = () => {
    onCopy(clip);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleCopy}
      className="group relative cursor-pointer overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.07] p-3.5 backdrop-blur-2xl"
      style={{ boxShadow: "0 12px 30px -18px rgba(0,0,0,.7)" }}
    >
      {/* pinned accent rail */}
      {clip.pinned && (
        <motion.div
          layout
          className="absolute left-0 top-1/2 h-[62%] w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-amber-300 to-amber-500"
        />
      )}

      <div className="flex items-start gap-3">
        {/* icon / swatch tile */}
        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]"
          style={{
            background: isColor
              ? clip.content
              : `linear-gradient(140deg, ${meta.from}, ${meta.to})`,
            boxShadow: isColor
              ? `0 6px 16px -6px ${clip.content}`
              : `0 8px 18px -8px ${meta.to}`,
          }}
        >
          {isColor ? (
            <span
              className={`text-[10px] font-bold uppercase ${
                isLight(clip.content) ? "text-black/70" : "text-white/90"
              }`}
            >
              HEX
            </span>
          ) : (
            <Icon className="h-[20px] w-[20px] text-white" strokeWidth={2.2} />
          )}
        </div>

        {/* body */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-white/70">
              {meta.label}
            </span>
            <span className="text-[11px] text-white/45">
              {timeAgo(clip.lastUsed)}
            </span>
            {clip.copiedCount > 0 && (
              <span className="text-[11px] text-white/45">
                · {clip.copiedCount}× copied
              </span>
            )}
          </div>

          <p
            className={`break-words text-[14px] leading-snug text-white/90 ${
              clip.type === "link" || clip.type === "code" ? "font-mono" : ""
            } line-clamp-3`}
          >
            {clip.content}
          </p>
        </div>
      </div>

      {/* action row */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(clip.id);
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            clip.pinned
              ? "bg-amber-400/20 text-amber-300"
              : "bg-white/8 text-white/55 hover:bg-white/15 hover:text-white"
          }`}
          aria-label={clip.pinned ? "Unpin" : "Pin"}
        >
          {clip.pinned ? (
            <Pin className="h-[15px] w-[15px] fill-current" />
          ) : (
            <PinOff className="h-[15px] w-[15px]" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(clip.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/55 transition-colors hover:bg-rose-500/25 hover:text-rose-300"
          aria-label="Delete"
        >
          <Trash2 className="h-[15px] w-[15px]" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-neutral-900 transition-transform active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-[15px] w-[15px]" strokeWidth={2.6} /> Copied
            </>
          ) : (
            <>
              <Copy className="h-[14px] w-[14px]" strokeWidth={2.4} /> Copy
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
