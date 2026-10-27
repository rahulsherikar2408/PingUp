import { Fragment } from "react";
import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { formatMessageDate, getMessageDateKey } from "../../lib/utils";

export function MessageList() {
  const { activeConversation, activeConversationId } = useSelectedConversation();

  const lastMessageId = activeConversation?.messages.at(-1)?.id;
  const messagesScrollRef = useScrollToBottom(activeConversationId, lastMessageId);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {activeConversation ? (
        <div
          ref={messagesScrollRef}
          className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3 sm:py-4"
        >
          {activeConversation.messages.map((message, index) => {
            const previousMessage = activeConversation.messages[index - 1];
            const currentDateKey = getMessageDateKey(message.createdAt);
            const previousDateKey = previousMessage ? getMessageDateKey(previousMessage.createdAt) : null;
            const showDateSeparator = currentDateKey !== previousDateKey;

            return (
              <Fragment key={message.id}>
                {showDateSeparator ? (
                  <div className="my-3 flex items-center justify-center">
                    <span className="rounded-full border border-border bg-surface/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted shadow-xs backdrop-blur-xs">
                      {formatMessageDate(message.createdAt)}
                    </span>
                  </div>
                ) : null}
                <MessageBubble message={message} />
              </Fragment>
            );
          })}
        </div>
      ) : (
        <NoConversationPlaceholder />
      )}
    </div>
  );
}
