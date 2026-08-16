import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export interface ToastState {
  id: number;
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
}

export default function Toast({ toast }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="pointer-events-none absolute left-1/2 top-[64px] z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 py-2 backdrop-blur-2xl"
        >
          <CheckCircle2 className="h-[17px] w-[17px] text-emerald-400" />
          <span className="text-[13px] font-semibold text-white">
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
