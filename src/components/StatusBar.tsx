import { useEffect, useState } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime(d: Date) {
  return d
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s?[AP]M/i, "");
}

export default function StatusBar() {
  const time = useClock();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[54px] items-center justify-between px-7 pt-3 text-white">
      <span className="text-[15px] font-semibold tracking-tight tabular-nums">
        {time}
      </span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-[15px] w-[15px]" strokeWidth={2.4} />
        <Wifi className="h-[15px] w-[15px]" strokeWidth={2.4} />
        <BatteryFull className="h-[22px] w-[22px]" strokeWidth={1.8} />
      </div>
    </div>
  );
}
