import { create } from "zustand";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";
import { ringtonePlayer } from "../lib/ringtone";
import toast from "react-hot-toast";

const CALL_TIMEOUT_MS = 30000; // 30 seconds unanswered timeout

let incomingTimeoutId = null;
let outgoingTimeoutId = null;

const clearCallTimers = () => {
  if (incomingTimeoutId) {
    clearTimeout(incomingTimeoutId);
    incomingTimeoutId = null;
  }
  if (outgoingTimeoutId) {
    clearTimeout(outgoingTimeoutId);
    outgoingTimeoutId = null;
  }
};

export const useCallStore = create((set, get) => ({
  client: null,
  call: null,
  callStatus: "idle", // 'idle' | 'calling' | 'incoming' | 'in-call'
  incomingCall: null, // { callId, caller }
  activePeer: null, // { _id, fullName, profilePic, email }
  isCallAnswered: false,
  isInitializing: false,

  initStreamClient: async (user) => {
    if (!user || get().client || get().isInitializing) return get().client;

    set({ isInitializing: true });
    try {
      const res = await axiosInstance.get("/stream/token");
      const { token, apiKey } = res.data;

      const client = new StreamVideoClient({
        apiKey: apiKey || import.meta.env.VITE_STREAM_API_KEY,
        user: {
          id: String(user._id),
          name: user.fullName || "User",
          image: user.profilePic || undefined,
        },
        token,
      });

      set({ client, isInitializing: false });
      return client;
    } catch (error) {
      console.error("Failed to initialize Stream Video client:", error);
      set({ isInitializing: false });
      return null;
    }
  },

  startCall: async (peerUser) => {
    if (!peerUser?._id) return;
    if (get().callStatus !== "idle") {
      toast.error("You are already in a call or connecting");
      return;
    }

    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    let client = get().client;
    if (!client) {
      client = await get().initStreamClient(authUser);
    }

    if (!client) {
      toast.error("Unable to connect to video calling service");
      return;
    }

    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    set({ callStatus: "calling", activePeer: peerUser, isCallAnswered: false });

    // Start outgoing ringtone so caller hears ringing feedback
    ringtonePlayer.play();

    // Start 30-second caller timeout: if receiver doesn't answer, disconnect
    clearCallTimers();
    outgoingTimeoutId = setTimeout(() => {
      const state = get();
      if (state.callStatus === "calling" || !state.isCallAnswered) {
        ringtonePlayer.stop();
        toast.error(`No answer from ${peerUser.fullName || "user"}. Call disconnected.`);
        get().endCall();
      }
    }, CALL_TIMEOUT_MS);

    try {
      // 1. Notify the backend and receiver via Socket.io
      const response = await axiosInstance.post("/stream/call", {
        receiverId: peerUser._id,
        callId,
      });

      if (!response.data.receiverOnline) {
        toast("User might be offline, waiting for connection...", { icon: "ℹ️" });
      }

      // Add the video call message to the chat view immediately
      if (response.data.callMessage) {
        const { activeConversationId, messages } = useChatStore.getState();
        if (activeConversationId === peerUser._id) {
          useChatStore.setState({
            messages: [...messages, response.data.callMessage],
          });
        }
        useChatStore.getState().getConversations();
      }

      // 2. Create and join the Stream call
      const call = client.call("default", callId);
      await call.join({ create: true });

      set({ call });
    } catch (error) {
      console.error("Failed to start call:", error);
      clearCallTimers();
      ringtonePlayer.stop();
      toast.error(error.response?.data?.message || "Failed to start video call");
      set({ call: null, callStatus: "idle", activePeer: null, isCallAnswered: false });
    }
  },

  handleIncomingCall: (incomingCallData) => {
    if (get().callStatus !== "idle") {
      // Already busy in another call: reject automatically
      const socket = useAuthStore.getState().socket;
      socket?.emit("rejectCall", {
        callerId: incomingCallData.caller._id,
        callId: incomingCallData.callId,
      });
      return;
    }

    clearCallTimers();
    // Play ringtone for incoming call
    ringtonePlayer.play();

    // Start 30-second receiver timeout: if receiver doesn't answer in 30s, auto-disconnect
    incomingTimeoutId = setTimeout(() => {
      const { incomingCall } = get();
      if (incomingCall) {
        ringtonePlayer.stop();
        toast(`Missed call from ${incomingCall.caller.fullName}`, { icon: "📞" });
        get().rejectCall();
      }
    }, CALL_TIMEOUT_MS);

    set({
      incomingCall: incomingCallData,
      callStatus: "incoming",
      activePeer: incomingCallData.caller,
      isCallAnswered: false,
    });
  },

  handleCallAccepted: () => {
    clearCallTimers();
    ringtonePlayer.stop();
    set({ callStatus: "in-call", isCallAnswered: true });
    toast.success("Call connected");
  },

  handleCallCancelled: () => {
    clearCallTimers();
    ringtonePlayer.stop();
    set({ incomingCall: null, callStatus: "idle", isCallAnswered: false });
  },

  acceptCall: async () => {
    clearCallTimers();
    ringtonePlayer.stop();

    const { incomingCall } = get();
    if (!incomingCall) return;

    const authUser = useAuthStore.getState().authUser;
    let client = get().client;
    if (!client && authUser) {
      client = await get().initStreamClient(authUser);
    }

    if (!client) {
      toast.error("Failed to initialize video call");
      get().rejectCall();
      return;
    }

    try {
      const call = client.call("default", incomingCall.callId);
      await call.join({ create: true });

      const socket = useAuthStore.getState().socket;
      socket?.emit("acceptCall", {
        callerId: incomingCall.caller._id,
        callId: incomingCall.callId,
      });

      set({
        call,
        callStatus: "in-call",
        activePeer: incomingCall.caller,
        incomingCall: null,
        isCallAnswered: true,
      });
    } catch (error) {
      console.error("Failed to accept call:", error);
      toast.error("Failed to join video call");
      get().rejectCall();
    }
  },

  rejectCall: () => {
    clearCallTimers();
    ringtonePlayer.stop();

    const { incomingCall } = get();
    if (incomingCall) {
      const socket = useAuthStore.getState().socket;
      socket?.emit("rejectCall", {
        callerId: incomingCall.caller._id,
        callId: incomingCall.callId,
      });
    }

    set({ incomingCall: null, callStatus: "idle", isCallAnswered: false });
  },

  endCall: async () => {
    clearCallTimers();
    ringtonePlayer.stop();

    const { call, activePeer, isCallAnswered } = get();
    const socket = useAuthStore.getState().socket;

    if (activePeer && socket) {
      if (!isCallAnswered) {
        socket.emit("cancelCall", {
          receiverId: activePeer._id,
          callId: call?.id,
        });
      }
      socket.emit("endCall", {
        peerId: activePeer._id,
        callId: call?.id,
      });
    }

    try {
      if (call) {
        await call.leave();
      }
    } catch (err) {
      console.error("Error leaving call:", err);
    }

    set({
      call: null,
      callStatus: "idle",
      activePeer: null,
      incomingCall: null,
      isCallAnswered: false,
    });
  },

  disconnectClient: () => {
    clearCallTimers();
    ringtonePlayer.stop();

    const { client } = get();
    if (client) {
      client.disconnectUser().catch(() => {});
    }
    set({
      client: null,
      call: null,
      callStatus: "idle",
      activePeer: null,
      incomingCall: null,
      isCallAnswered: false,
    });
  },
}));
