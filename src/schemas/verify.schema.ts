import { z } from 'zod'

export const verifySchima = z.object({
  verificationCode: z.string().length(6, 'Verification Code Mustbe 6 Difits')
})
