import { useWallpaper } from "../context/wallpaper";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useCallStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import { useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { ChatComposer } from "../components/chat/ChatComposer";
import { IncomingCallDialog } from "../components/video/IncomingCallDialog";
import { VideoCallModal } from "../components/video/VideoCallModal";
import toast from "react-hot-toast";

function ChatPage() {
  const { frameStyle } = useWallpaper();

  const getConversations = useChatStore((state) => state.getConversations);
  const getMessages = useChatStore((state) => state.getMessages);
  const getUsers = useChatStore((state) => state.getUsers);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  const authUser = useAuthStore((state) => state.authUser);
  const socket = useAuthStore((state) => state.socket);

  const initStreamClient = useCallStore((state) => state.initStreamClient);
  const handleIncomingCall = useCallStore((state) => state.handleIncomingCall);
  const endCall = useCallStore((state) => state.endCall);

  const { activeConversation, activeConversationId, isLargeScreen } = useSelectedConversation();

  // Initialize data and Stream Video client
  useEffect(() => {
    getUsers();
    getConversations();
    if (authUser) {
      initStreamClient(authUser);
    }
  }, [getConversations, getUsers, authUser, initStreamClient]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    getMessages(activeConversationId);
  }, [getMessages, activeConversationId]);

  // Socket event listeners for messages and video calling
  useEffect(() => {
    if (!socket) return;

    subscribeToMessages();

    const onIncomingCall = (data) => {
      handleIncomingCall(data);
    };

    const onCallRejected = () => {
      toast.error("Call was declined");
      endCall();
    };

    const onCallEnded = () => {
      toast("Call ended", { icon: "📞" });
      endCall();
    };

    const onCallCancelled = () => {
      toast("Caller cancelled the call", { icon: "ℹ️" });
      useCallStore.setState({ incomingCall: null, callStatus: "idle" });
    };

    socket.on("incomingCall", onIncomingCall);
    socket.on("callRejected", onCallRejected);
    socket.on("callEnded", onCallEnded);
    socket.on("callCancelled", onCallCancelled);

    return () => {
      unsubscribeFromMessages();
      socket.off("incomingCall", onIncomingCall);
      socket.off("callRejected", onCallRejected);
      socket.off("callEnded", onCallEnded);
      socket.off("callCancelled", onCallCancelled);
    };
  }, [socket, subscribeToMessages, unsubscribeFromMessages, handleIncomingCall, endCall]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8" style={frameStyle}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        <ChatSidebar />

        <div
          className={`flex-1 flex-col overflow-hidden ${
            !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
          }`}
        >
          <ChatHeader />
          <MessageList />

          {activeConversation ? <ChatComposer /> : null}
        </div>
      </div>

      {/* Video Calling Overlays */}
      <IncomingCallDialog />
      <VideoCallModal />
    </div>
  );
}
export default ChatPage;
