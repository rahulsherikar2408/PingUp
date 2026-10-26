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
  const endCall = useCallStore((state) => state.endCall);

  if (callStatus !== "in-call" && callStatus !== "calling") return null;
  if (!client || !call) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-3">
            {activePeer?.profilePic ? (
              <img
                src={activePeer.profilePic}
                alt={activePeer.fullName}
                className="size-8 rounded-full object-cover"
              />
            ) : null}
            <div>
              <h2 className="text-sm font-semibold leading-none text-foreground">
                {activePeer?.fullName || "Video Call"}
              </h2>
              <p className="text-xs text-muted">PingUp Video Call</p>
            </div>
          </div>

          <button
            type="button"
            onClick={endCall}
            className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <XIcon className="size-5" />
          </button>
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
