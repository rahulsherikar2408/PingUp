import mongoose from "mongoose";
import { generateStreamToken, hasStreamConfig } from "../lib/stream.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export async function getStreamToken(req, res) {
  try {
    if (!hasStreamConfig()) {
      return res.status(500).json({ message: "Stream Video is not configured on the server" });
    }

    const { token, apiKey } = await generateStreamToken(req.user);

    res.status(200).json({ token, apiKey });
  } catch (error) {
    console.error("Error generating Stream token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function initiateCall(req, res) {
  try {
    const { receiverId, callId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    if (!callId) {
      return res.status(400).json({ message: "callId is required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);

    // Create a video call message in the chat
    const callMessage = new Message({
      senderId: req.user._id,
      receiverId,
      text: "📹 Video call started",
    });
    await callMessage.save();

    // Broadcast new message to receiver in real time
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", callMessage);
    }

    // Send incoming call notification to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", {
        callId,
        caller: {
          _id: req.user._id,
          fullName: req.user.fullName,
          profilePic: req.user.profilePic,
          email: req.user.email,
        },
      });
    }

    res.status(200).json({
      success: true,
      callId,
      receiverOnline: Boolean(receiverSocketId),
      callMessage,
    });
  } catch (error) {
    console.error("Error initiating call:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
