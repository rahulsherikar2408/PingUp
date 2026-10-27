import { Avatar } from "@heroui/react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

export function ConversationRow({ user, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-all cursor-pointer touch-manipulation active:scale-[0.99] ${
        selected
          ? "bg-accent-soft/80 font-medium"
          : "hover:bg-accent-soft/30 active:bg-accent-soft/40"
      }`}
    >
      <AvatarWithOnlineIndicator isOnline={user.isOnline ?? true}>
        <Avatar className="size-11 sm:size-12 shrink-0">
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          <Avatar.Fallback className="text-xs sm:text-sm font-medium">{user.initials}</Avatar.Fallback>
        </Avatar>
      </AvatarWithOnlineIndicator>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm sm:text-[15px] font-semibold">{user.name}</p>
        <p className="truncate text-[11px] sm:text-xs text-muted">
          {user.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </button>
  );
}
