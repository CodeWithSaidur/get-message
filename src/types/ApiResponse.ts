import { Message } from '@/models/Message.model'

export interface ApiResponse {
  success: boolean
  message: string
  fileName?: string
  isAcceptingMessages?: boolean
  messages?: Array<Message>
}
