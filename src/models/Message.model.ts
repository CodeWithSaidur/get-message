import mongoose, { Schema, Types } from 'mongoose'

export interface Message {
  message: string
  createdAt: Date
  user: Types.ObjectId
}

const messageSchema = new Schema<Message>({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>('Message', messageSchema)
