import mongoose from 'mongoose'
import { Message } from './Message.model'

export interface User {
  username: string
  email: string
  password: string
  verificationCode: string
  verificationCodeExpiry: Date
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
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    verificationCode: {
      type: String,
      required: [true, 'Verification Code is Required']
    },
    verificationCodeExpiry: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
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
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', userSchema)
