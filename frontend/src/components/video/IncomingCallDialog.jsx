import { useState, useEffect } from "react";
import { VideoIcon, PhoneOffIcon, ClockIcon } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";

export function IncomingCallDialog() {
  const incomingCall = useCallStore((state) => state.incomingCall);
  const acceptCall = useCallStore((state) => state.acceptCall);
  const rejectCall = useCallStore((state) => state.rejectCall);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (!incomingCall) {
      setSecondsLeft(30);
      return;
    }

    setSecondsLeft(30);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingCall]);

  if (!incomingCall) return null;

  const caller = incomingCall.caller;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xl">
        {/* Pulsing Avatar */}
        <div className="relative mb-4 flex size-20 sm:size-24 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/40 opacity-75" />
          <span className="absolute inline-flex size-16 sm:size-20 animate-pulse rounded-full bg-accent/20" />
          <img
            src={caller.profilePic || "https://i.pravatar.cc/150"}
            alt={caller.fullName}
            className="relative size-16 sm:size-20 rounded-full border-2 border-accent object-cover shadow-lg"
          />
        </div>

        {/* Caller Info */}
        <h3 className="text-base sm:text-lg font-bold text-foreground truncate max-w-full">
          {caller.fullName}
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-muted">Incoming Video Call...</p>

        {/* 30-second Auto-disconnect Countdown Badge */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted shadow-xs">
          <ClockIcon className="size-3.5 text-accent animate-pulse" />
          <span>Auto-disconnects in {secondsLeft}s</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex w-full items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={rejectCall}
              className="flex size-13 sm:size-14 items-center justify-center rounded-full bg-danger text-danger-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Decline Call"
              title="Decline"
            >
              <PhoneOffIcon className="size-6" />
            </button>
            <span className="text-[11px] font-medium text-muted">Decline</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={acceptCall}
              className="flex size-13 sm:size-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Accept Call"
              title="Accept"
            >
              <VideoIcon className="size-6" />
            </button>
            <span className="text-[11px] font-medium text-muted">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
