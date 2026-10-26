import { create } from "zustand";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useCallStore = create((set, get) => ({
  client: null,
  call: null,
  callStatus: "idle", // 'idle' | 'calling' | 'incoming' | 'in-call'
  incomingCall: null, // { callId, caller }
  activePeer: null, // { _id, fullName, profilePic, email }
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
    set({ callStatus: "calling", activePeer: peerUser });

    try {
      // 1. Notify the backend and receiver via Socket.io
      const response = await axiosInstance.post("/stream/call", {
        receiverId: peerUser._id,
        callId,
      });

      if (!response.data.receiverOnline) {
        toast("User might be offline, waiting for connection...", { icon: "ℹ️" });
      }

      // 2. Create and join the Stream call
      const call = client.call("default", callId);
      await call.join({ create: true });

      set({ call, callStatus: "in-call" });
    } catch (error) {
      console.error("Failed to start call:", error);
      toast.error(error.response?.data?.message || "Failed to start video call");
      set({ call: null, callStatus: "idle", activePeer: null });
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

    set({
      incomingCall: incomingCallData,
      callStatus: "incoming",
    });
  },

  acceptCall: async () => {
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
      });
    } catch (error) {
      console.error("Failed to accept call:", error);
      toast.error("Failed to join video call");
      get().rejectCall();
    }
  },

  rejectCall: () => {
    const { incomingCall } = get();
    if (incomingCall) {
      const socket = useAuthStore.getState().socket;
      socket?.emit("rejectCall", {
        callerId: incomingCall.caller._id,
        callId: incomingCall.callId,
      });
    }

    set({ incomingCall: null, callStatus: "idle" });
  },

  endCall: async () => {
    const { call, activePeer } = get();
    const socket = useAuthStore.getState().socket;

    if (activePeer && socket) {
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
    });
  },

  disconnectClient: () => {
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
    });
  },
}));
