import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Plus,
  X,
  ClipboardList,
  Pin,
  Trash2,
  ShieldCheck,
  ScanSearch,
  Copy,
  Eraser,
  ClipboardPaste,
  Send,
} from "lucide-react";
import PhoneFrame from "./components/PhoneFrame";
import ClipCard from "./components/ClipCard";
import Toast, { type ToastState } from "./components/Toast";
import Logo from "./components/Logo";
import type { Clip, FilterKey } from "./types";
import { TYPE_META, TYPE_ORDER } from "./lib/meta";
import {
  detectType,
  loadClips,
  saveClips,
  uid,
  loadNote,
  saveNote,
} from "./lib/clipboard";

function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg,#081226 0%,#0c2050 30%,#123374 55%,#18407f 80%,#08152c 100%)",
        }}
      />
      <div
        className="absolute -left-16 top-6 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{ background: "#3b82f6", animation: "floaty 13s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-20 top-44 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "#38bdf8", animation: "floaty 17s ease-in-out infinite 1s" }}
      />
      <div
        className="absolute -bottom-24 left-10 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "#1d4ed8", animation: "floaty 15s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute bottom-10 right-0 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: "#0ea5e9", animation: "floaty 19s ease-in-out infinite .5s" }}
      />
    </div>
  );
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pinned", label: "Pinned" },
  ...TYPE_ORDER.map((t) => ({ key: t as FilterKey, label: TYPE_META[t].label })),
];

export default function App() {
  const [clips, setClips] = useState<Clip[]>(() => loadClips());
  const [note, setNote] = useState<string>(() => loadNote());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => saveClips(clips), [clips]);
  useEffect(() => saveNote(note), [note]);

  useEffect(() => {
    if (!toast) return;
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1700);
    return () => window.clearTimeout(toastTimer.current);
  }, [toast]);

  const showToast = (message: string) =>
    setToast({ id: Date.now(), message });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clips
      .filter((c) =>
        filter === "all"
          ? true
          : filter === "pinned"
            ? c.pinned
            : c.type === filter,
      )
      .filter((c) => (q ? c.content.toLowerCase().includes(q) : true))
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) || b.lastUsed - a.lastUsed,
      );
  }, [clips, filter, query]);

  const totalCopies = useMemo(
    () => clips.reduce((sum, c) => sum + c.copiedCount, 0),
    [clips],
  );

  const addClip = (content: string) => {
    const ts = Date.now();
    setClips((prev) => [
      {
        id: uid(),
        content,
        type: detectType(content),
        createdAt: ts,
        lastUsed: ts,
        pinned: false,
        copiedCount: 0,
      },
      ...prev,
    ]);
    showToast("Saved to Clipstash");
  };

  const removeClip = (id: string) =>
    setClips((prev) => prev.filter((c) => c.id !== id));

  const togglePin = (id: string) =>
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    );

  const copyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; still surface feedback */
    }
    showToast(message);
  };

  const copyClip = (clip: Clip) => {
    setClips((prev) =>
      prev.map((c) =>
        c.id === clip.id
          ? { ...c, copiedCount: c.copiedCount + 1, lastUsed: Date.now() }
          : c,
      ),
    );
    copyText(clip.content, "Copied to clipboard");
  };

  const clearAll = () => {
    setClips([]);
    showToast("Clipstash cleared");
  };

  // composer actions (all the former "notes" features, now inline)
  const postClip = () => {
    const text = note.trim();
    if (!text) return;
    addClip(text);
    setNote("");
  };

  const pasteInto = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setNote((n) => (n ? n + "\n" + text : text));
    } catch {
      /* clipboard read may be blocked */
    }
  };

  const hasClips = clips.length > 0;
  const noteChars = note.trim().length;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060a] px-4 py-6">
      {/* ambient page backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(37,99,235,.25), transparent 60%), radial-gradient(900px 500px at 100% 100%, rgba(14,165,233,.18), transparent 60%)",
        }}
      />

      <PhoneFrame>
        <div className="relative h-full w-full">
          <Wallpaper />
          <div className="absolute inset-0 bg-black/20" />

          {/* app surface */}
          <div className="absolute inset-0 z-10 flex flex-col pt-7">
            {/* title row */}
            <div className="flex items-center justify-between px-5 pb-1">
              <div className="flex items-center gap-2.5">
                <Logo size={34} className="drop-shadow-lg" />
                <div>
                  <h2 className="text-[28px] font-bold leading-none tracking-tight text-white">
                    Clipstash
                  </h2>
                  <p className="mt-1.5 text-[12.5px] text-white/55">
                    {hasClips
                      ? `${clips.length} clips · ${totalCopies} copies`
                      : "Nothing copied yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-2.5 py-1.5 text-[11px] font-semibold text-white/75 backdrop-blur-xl">
                <ShieldCheck className="h-[14px] w-[14px] text-emerald-300" />
                On-device
              </div>
            </div>

            {/* composer — post anything (carries all notes features) */}
            <div className="mt-3 px-4">
              <div className="rounded-[22px] border border-white/12 bg-white/8 p-2 backdrop-blur-xl">
                <textarea
                  ref={composerRef}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") postClip();
                  }}
                  rows={2}
                  placeholder="Post anything — paste a link, code or any text…"
                  className="no-scrollbar block max-h-32 min-h-[44px] w-full resize-none bg-transparent px-2 py-1.5 text-[14px] leading-snug text-white placeholder:text-white/35 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-2 px-1 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={pasteInto}
                      title="Paste from clipboard"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                    >
                      <ClipboardPaste className="h-[14px] w-[14px]" />
                    </button>
                    <span className="text-[11px] text-white/40">
                      {noteChars > 0 ? `${noteChars} chars` : "Auto-saved"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNote("")}
                      disabled={noteChars === 0}
                      title="Clear"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30"
                    >
                      <Eraser className="h-[14px] w-[14px]" />
                    </button>
                    <button
                      onClick={() => copyText(note, "Copied to clipboard")}
                      disabled={noteChars === 0}
                      title="Copy"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30"
                    >
                      <Copy className="h-[14px] w-[14px]" />
                    </button>
                    <button
                      onClick={postClip}
                      disabled={noteChars === 0}
                      className="flex items-center gap-1 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 px-3.5 py-1.5 text-[12.5px] font-bold text-white shadow-lg shadow-blue-900/40 transition-transform active:scale-95 disabled:opacity-40"
                    >
                      <Send className="h-[13px] w-[13px]" /> Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* search */}
            <div className="px-4 pt-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-3.5 py-2.5 backdrop-blur-xl">
                <Search className="h-[16px] w-[16px] text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clips"
                  className="w-full bg-transparent text-[14px] text-white placeholder:text-white/35 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="h-[15px] w-[15px]" />
                  </button>
                )}
              </div>
            </div>

            {/* filter pills */}
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className="relative shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="pillbg"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 480, damping: 36 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        active ? "text-neutral-900" : "text-white/65"
                      }`}
                    >
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* list */}
            <div className="no-scrollbar mt-2 flex-1 space-y-2.5 overflow-y-auto px-4 pb-28 pt-1">
              <AnimatePresence mode="popLayout">
                {visible.map((clip) => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    onCopy={copyClip}
                    onTogglePin={togglePin}
                    onDelete={removeClip}
                  />
                ))}
              </AnimatePresence>

              {visible.length === 0 && (
                <EmptyState
                  hasClips={hasClips}
                  searching={!!query}
                  onAdd={() => composerRef.current?.focus()}
                />
              )}

              {hasClips && visible.length > 0 && (
                <button
                  onClick={clearAll}
                  className="mx-auto mt-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-white/40 transition-colors hover:text-rose-300"
                >
                  <Trash2 className="h-[13px] w-[13px]" /> Clear all clips
                </button>
              )}
            </div>
          </div>

          <Toast toast={toast} />
        </div>
      </PhoneFrame>

      {/* feature chips under the phone */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2">
        {[
          { icon: ScanSearch, label: "Smart type detection" },
          { icon: Pin, label: "Pin & search" },
          { icon: Send, label: "Post anything" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 backdrop-blur"
          >
            <Icon className="h-[13px] w-[13px] text-sky-300" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  hasClips,
  searching,
  onAdd,
}: {
  hasClips: boolean;
  searching: boolean;
  onAdd: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 pt-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/12 bg-white/8 backdrop-blur-xl">
        {searching ? (
          <Search className="h-7 w-7 text-white/60" />
        ) : (
          <ClipboardList className="h-7 w-7 text-white/60" />
        )}
      </div>
      <p className="mt-4 text-[15px] font-semibold text-white">
        {searching
          ? "No matches found"
          : hasClips
            ? "Nothing here yet"
            : "Your Clipstash is empty"}
      </p>
      <p className="mt-1 max-w-[240px] text-[12.5px] text-white/45">
        {searching
          ? "Try a different search term."
          : "Type or paste into the box above, then hit Post."}
      </p>
      {!searching && (
        <button
          onClick={onAdd}
          className="mt-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-neutral-900 active:scale-95"
        >
          <Plus className="h-[15px] w-[15px]" strokeWidth={2.6} /> Add your first
          clip
        </button>
      )}
    </motion.div>
  );
}
