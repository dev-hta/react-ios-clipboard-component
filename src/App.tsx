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
  Wand2,
} from "lucide-react";
import PhoneFrame from "./components/PhoneFrame";
import StatusBar from "./components/StatusBar";
import ClipCard from "./components/ClipCard";
import AddClipSheet from "./components/AddClipSheet";
import Toast, { type ToastState } from "./components/Toast";
import type { Clip, FilterKey } from "./types";
import { TYPE_META, TYPE_ORDER } from "./lib/meta";
import { detectType, loadClips, saveClips, uid } from "./lib/clipboard";

function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg,#1b1140 0%,#2a1a5e 32%,#3d1f6b 55%,#6d1f5c 80%,#3a1530 100%)",
        }}
      />
      <div
        className="absolute -left-16 top-6 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{ background: "#7c3aed", animation: "floaty 13s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-20 top-44 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "#db2777", animation: "floaty 17s ease-in-out infinite 1s" }}
      />
      <div
        className="absolute -bottom-24 left-10 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "#2563eb", animation: "floaty 15s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute bottom-10 right-0 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: "#f59e0b", animation: "floaty 19s ease-in-out infinite .5s" }}
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
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => saveClips(clips), [clips]);

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
    showToast("Saved to clipboard");
  };

  const removeClip = (id: string) =>
    setClips((prev) => prev.filter((c) => c.id !== id));

  const togglePin = (id: string) =>
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    );

  const copyClip = async (clip: Clip) => {
    try {
      await navigator.clipboard.writeText(clip.content);
    } catch {
      /* clipboard may be blocked; still surface feedback */
    }
    setClips((prev) =>
      prev.map((c) =>
        c.id === clip.id
          ? { ...c, copiedCount: c.copiedCount + 1, lastUsed: Date.now() }
          : c,
      ),
    );
    showToast("Copied to clipboard");
  };

  const clearAll = () => {
    setClips([]);
    showToast("Clipboard cleared");
  };

  const hasClips = clips.length > 0;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060a] px-4 py-6">
      {/* ambient page backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(124,58,237,.25), transparent 60%), radial-gradient(900px 500px at 100% 100%, rgba(219,39,119,.18), transparent 60%)",
        }}
      />

      <header className="relative z-10 mb-4 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Built for iOS 27 · Liquid Glass
        </div>
        <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-sky-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Clipboard
        </h1>
        <p className="mt-2 max-w-md text-[14px] text-white/50">
          The clipboard manager your iPhone always needed — capture, organize
          and re-copy anything in one tap.
        </p>
      </header>

      <PhoneFrame>
        <div className="relative h-full w-full">
          <Wallpaper />
          <div className="absolute inset-0 bg-black/20" />
          <StatusBar />

          {/* scrollable app surface */}
          <div className="absolute inset-0 z-10 flex flex-col pt-[58px]">
            {/* title row */}
            <div className="flex items-end justify-between px-5 pb-1">
              <div>
                <h2 className="text-[30px] font-bold leading-none tracking-tight text-white">
                  Clipboard
                </h2>
                <p className="mt-1.5 text-[12.5px] text-white/55">
                  {hasClips
                    ? `${clips.length} clips · ${totalCopies} copies`
                    : "Nothing copied yet"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-2.5 py-1.5 text-[11px] font-semibold text-white/75 backdrop-blur-xl">
                  <ShieldCheck className="h-[14px] w-[14px] text-emerald-300" />
                  On-device
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
                  onAdd={() => setShowAdd(true)}
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

          {/* compose FAB */}
          <motion.button
            onClick={() => setShowAdd(true)}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
            className="absolute bottom-[30px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/25"
            style={{
              background: "linear-gradient(140deg,#a78bfa,#6d28d9)",
              boxShadow: "0 14px 30px -8px rgba(109,40,217,.7)",
            }}
            aria-label="Add clip"
          >
            <Plus className="h-7 w-7 text-white" strokeWidth={2.6} />
          </motion.button>

          <Toast toast={toast} />
          <AddClipSheet
            open={showAdd}
            onClose={() => setShowAdd(false)}
            onAdd={addClip}
          />
        </div>
      </PhoneFrame>

      {/* feature chips under the phone */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2">
        {[
          { icon: ScanSearch, label: "Smart type detection" },
          { icon: Pin, label: "Pin & search" },
          { icon: Wand2, label: "Glass UI & springs" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 backdrop-blur"
          >
            <Icon className="h-[13px] w-[13px] text-violet-300" />
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
      className="flex flex-col items-center justify-center px-6 pt-16 text-center"
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
            : "Your clipboard is empty"}
      </p>
      <p className="mt-1 max-w-[240px] text-[12.5px] text-white/45">
        {searching
          ? "Try a different search term."
          : "Tap the + button to paste a link, code, or any text you want to keep."}
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
