import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ClipboardPaste, Plus, Sparkles } from "lucide-react";
import { detectType } from "../lib/clipboard";
import { TYPE_META } from "../lib/meta";

interface AddClipSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (content: string) => void;
}

export default function AddClipSheet({
  open,
  onClose,
  onAdd,
}: AddClipSheetProps) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const detected = trimmed ? detectType(trimmed) : null;

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const submit = () => {
    if (!trimmed) return;
    onAdd(trimmed);
    onClose();
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setValue((v) => (v ? v + "\n" + text : text));
    } catch {
      setValue((v) => v);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-[60] bg-black/55 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="absolute inset-x-0 bottom-0 z-[61] rounded-t-[34px] border-t border-white/15 bg-[#1c1c24]/85 p-5 pb-8 backdrop-blur-3xl"
            style={{ boxShadow: "0 -20px 60px -20px rgba(0,0,0,.8)" }}
          >
            <div className="mx-auto mb-4 h-[5px] w-10 rounded-full bg-white/25" />

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <h2 className="text-[18px] font-bold text-white">New Clip</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="relative">
              <textarea
                value={value}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
                }}
                placeholder="Paste or type anything…"
                className="h-32 w-full resize-none rounded-2xl border border-white/12 bg-black/30 p-3.5 text-[15px] text-white placeholder:text-white/30 focus:border-violet-400/60 focus:outline-none"
              />
              <button
                onClick={paste}
                className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/20"
              >
                <ClipboardPaste className="h-[13px] w-[13px]" /> Paste
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12.5px] text-white/55">
                {detected ? (
                  <>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: `linear-gradient(140deg, ${TYPE_META[detected].from}, ${TYPE_META[detected].to})`,
                      }}
                    />
                    Detected as{" "}
                    <span className="font-semibold text-white/80">
                      {TYPE_META[detected].label}
                    </span>
                  </>
                ) : (
                  <span>Auto-detects links, codes, emails & more</span>
                )}
              </div>

              <button
                onClick={submit}
                disabled={!trimmed}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 px-4 py-2 text-[13.5px] font-bold text-white shadow-lg shadow-indigo-900/40 transition-all active:scale-95 disabled:opacity-40"
              >
                <Plus className="h-[16px] w-[16px]" strokeWidth={2.6} /> Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
