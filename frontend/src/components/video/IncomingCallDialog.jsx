import { VideoIcon, PhoneOffIcon } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";

export function IncomingCallDialog() {
  const incomingCall = useCallStore((state) => state.incomingCall);
  const acceptCall = useCallStore((state) => state.acceptCall);
  const rejectCall = useCallStore((state) => state.rejectCall);

  if (!incomingCall) return null;

  const caller = incomingCall.caller;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        {/* Pulsing Avatar */}
        <div className="relative mb-4 flex size-24 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/40 opacity-75" />
          <span className="absolute inline-flex size-20 animate-pulse rounded-full bg-accent/20" />
          <img
            src={caller.profilePic || "https://i.pravatar.cc/150"}
            alt={caller.fullName}
            className="relative size-20 rounded-full border-2 border-accent object-cover shadow-lg"
          />
        </div>

        {/* Caller Info */}
        <h3 className="text-lg font-bold text-foreground">{caller.fullName}</h3>
        <p className="mt-0.5 text-sm text-muted">Incoming Video Call...</p>

        {/* Action Buttons */}
        <div className="mt-6 flex w-full items-center justify-center gap-6">
          <button
            type="button"
            onClick={rejectCall}
            className="flex size-14 items-center justify-center rounded-full bg-danger text-danger-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Decline Call"
            title="Decline"
          >
            <PhoneOffIcon className="size-6" />
          </button>

          <button
            type="button"
            onClick={acceptCall}
            className="flex size-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Accept Call"
            title="Accept"
          >
            <VideoIcon className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
