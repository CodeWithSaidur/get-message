import { z } from 'zod'

export const signinSchima = z.object({
  isAcceptingMessage: z.boolean()
})
