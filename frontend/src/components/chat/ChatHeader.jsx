import { Avatar, Button } from "@heroui/react";
import { ChevronLeftIcon, VideoIcon, Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import { AppLogo } from "../AppLogo";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";
import { AppearanceControls } from "../AppearanceControls";

import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useCallStore } from "../../store/useCallStore";

export function ChatHeader() {
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);

  const startCall = useCallStore((state) => state.startCall);
  const callStatus = useCallStore((state) => state.callStatus);

  const { activeConversation, isLargeScreen } = useSelectedConversation();

  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-1 border-b border-border bg-surface/90 px-2 py-2 backdrop-blur-md sm:gap-2 sm:px-3">
      {/* Left section: Back button + Peer or App info */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2.5">
        {activeConversation && !isLargeScreen ? (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            className="size-8 shrink-0 text-foreground transition-transform active:scale-95"
            aria-label="Back to chat list"
            title="Back to chat list"
            onPress={() => setActiveConversationId(null)}
          >
            <ChevronLeftIcon className="size-5 sm:size-6" strokeWidth={2.25} />
          </Button>
        ) : null}

        {activeConversation ? (
          <>
            <AvatarWithOnlineIndicator isOnline={activeConversation.peer.isOnline ?? true}>
              <Avatar className="size-8 shrink-0 sm:size-9">
                <Avatar.Image
                  alt={activeConversation.peer.name}
                  src={activeConversation.peer.avatarUrl}
                />
                <Avatar.Fallback className="text-xs sm:text-sm font-medium">
                  {activeConversation.peer.initials}
                </Avatar.Fallback>
              </Avatar>
            </AvatarWithOnlineIndicator>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm sm:text-[15px] font-semibold leading-tight">
                {activeConversation.peer.name}
              </p>
              <p className="truncate text-[11px] sm:text-xs text-muted">
                {activeConversation.peer.isOnline ? (
                  <span className="font-medium text-success">Online</span>
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
            <AppLogo size={32} className="size-8 shrink-0 rounded-[9px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-[13px] font-medium text-muted">Select a conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Right section: Action buttons + Appearance Controls */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        {activeConversation ? (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            className="size-8 sm:size-8.5 shrink-0 text-accent hover:bg-accent-soft transition-transform active:scale-95"
            aria-label="Start video call"
            title="Start video call"
            isDisabled={callStatus !== "idle"}
            onPress={() =>
              startCall({
                _id: activeConversation.id,
                fullName: activeConversation.peer.name,
                profilePic: activeConversation.peer.avatarUrl,
                email: activeConversation.peer.subtitle,
              })
            }
          >
            <VideoIcon className="size-4.5 sm:size-5" strokeWidth={2} aria-hidden />
          </Button>
        ) : null}

        <AppearanceControls compact />

        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="size-8 sm:size-8.5 shrink-0 text-foreground transition-transform active:scale-95"
          aria-label={isSoundEnabled ? "Mute typing sound" : "Enable typing sound"}
          title={isSoundEnabled ? "Mute typing sound" : "Enable typing sound"}
          aria-pressed={isSoundEnabled}
          onPress={() => setSoundEnabled(!isSoundEnabled)}
        >
          {isSoundEnabled ? (
            <Volume2Icon className="size-4.5 sm:size-5" strokeWidth={2} aria-hidden />
          ) : (
            <VolumeXIcon className="size-4.5 sm:size-5" strokeWidth={2} aria-hidden />
          )}
        </Button>

        {activeConversation && isLargeScreen ? (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            className="size-8 sm:size-8.5 shrink-0 text-foreground transition-transform active:scale-95"
            aria-label="Close chat"
            title="Close chat"
            onPress={() => setActiveConversationId(null)}
          >
            <XIcon className="size-4.5 sm:size-5" strokeWidth={2} aria-hidden />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
