import { z } from 'zod'

export const acceptsMessageSchima = z.object({
  isAcceptingMessage: z.boolean()
})
