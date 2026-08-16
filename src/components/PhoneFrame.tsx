import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * A stylised iOS 27 device shell: titanium rail, rounded screen and the
 * Dynamic Island. Scales down on small viewports.
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: "min(92vw, 402px)",
        height: "min(197vw, 852px, 86vh)",
      }}
    >
      {/* titanium rail */}
      <div
        className="absolute inset-0 rounded-[3.4rem] p-[3px]"
        style={{
          background:
            "linear-gradient(150deg,#4a4a52 0%,#9a9aa3 18%,#3a3a42 42%,#cfcfd6 60%,#54545c 82%,#2c2c33 100%)",
          boxShadow:
            "0 50px 90px -30px rgba(0,0,0,.8), 0 20px 50px -20px rgba(80,40,160,.55), inset 0 0 2px rgba(255,255,255,.4)",
        }}
      >
        {/* inner bezel */}
        <div className="relative h-full w-full rounded-[3.15rem] bg-black p-[10px]">
          {/* screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-black">
            {children}

            {/* Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-[11px] z-50 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black">
              <div className="absolute right-3 top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-[#0b1a14] ring-1 ring-emerald-500/20">
                <div className="absolute inset-[2px] rounded-full bg-[#0e2a1f]" />
              </div>
            </div>

            {/* home indicator */}
            <div className="pointer-events-none absolute bottom-[7px] left-1/2 z-50 h-[5px] w-[128px] -translate-x-1/2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* side buttons */}
      <div className="absolute -left-[3px] top-[120px] h-8 w-[3px] rounded-l bg-neutral-500/70" />
      <div className="absolute -left-[3px] top-[172px] h-14 w-[3px] rounded-l bg-neutral-500/70" />
      <div className="absolute -left-[3px] top-[246px] h-14 w-[3px] rounded-l bg-neutral-500/70" />
      <div className="absolute -right-[3px] top-[200px] h-24 w-[3px] rounded-r bg-neutral-500/70" />
    </div>
  );
}
