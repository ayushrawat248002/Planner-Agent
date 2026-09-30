import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;
  messageNo: number;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageNo: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system", "tool"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Used for pagination
ChatMessageSchema.index({
  conversationId: 1,
  messageNo: -1,
});

// Prevent duplicate message numbers
ChatMessageSchema.index(
  {
    conversationId: 1,
    messageNo: 1,
  },
  {
    unique: true,
  }
);

const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

export default ChatMessage;