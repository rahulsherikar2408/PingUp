import {
  StreamVideo,
  StreamTheme,
  StreamCall,
  SpeakerLayout,
  CallControls,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader2Icon, XIcon } from "lucide-react";
import { useCallStore } from "../../store/useCallStore";
import { AppearanceControls } from "../AppearanceControls";

function CallInterface() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const endCall = useCallStore((state) => state.endCall);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted">
        <Loader2Icon className="size-8 animate-spin text-accent" />
        <p className="text-sm font-medium">Connecting to video call...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>
      <div className="shrink-0 py-2">
        <CallControls onLeave={endCall} />
      </div>
    </div>
  );
}

export function VideoCallModal() {
  const client = useCallStore((state) => state.client);
  const call = useCallStore((state) => state.call);
  const callStatus = useCallStore((state) => state.callStatus);
  const activePeer = useCallStore((state) => state.activePeer);
  const isCallAnswered = useCallStore((state) => state.isCallAnswered);
  const endCall = useCallStore((state) => state.endCall);

  if (callStatus !== "in-call" && callStatus !== "calling") return null;
  if (!client || !call) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full sm:h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            {activePeer?.profilePic ? (
              <img
                src={activePeer.profilePic}
                alt={activePeer.fullName}
                className="size-7 sm:size-8 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xs sm:text-sm font-semibold leading-none text-foreground">
                {activePeer?.fullName || "Video Call"}
              </h2>
              <p className="truncate text-[10px] sm:text-xs text-muted">
                {isCallAnswered ? "Connected" : "Ringing... (waiting for user to answer)"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <AppearanceControls compact showPreset={false} />
            <button
              type="button"
              onClick={endCall}
              className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close"
              title="End / Close Call"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Video stream container */}
        <StreamVideo client={client}>
          <StreamTheme as="div" className="flex flex-1 flex-col overflow-hidden bg-black text-white">
            <StreamCall call={call}>
              <CallInterface />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      </div>
    </div>
  );
}
