import mongoose from 'mongoose'
import { Message } from './Message.model'

export interface User {
  username: string
  email: string
  password: string
  verificationCode: string
  verificationCodeExpirt: Date
  isVerified: boolean
  isAcceptingMessage: boolean
  messages: Message[]
}

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: [true, 'Username is Required'],
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Enter a Valid Email Address']
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    verificationCode: {
      type: String,
      required: [true, 'Verification Code is Required']
    },
    verificationCodeExpirt: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  {
    timestamps: true
  }
)

export const UserModel =
  mongoose.models.User || mongoose.model<User>('User', userSchema)
