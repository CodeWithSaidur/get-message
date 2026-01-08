import { z } from 'zod'

export const signinSchima = z.object({
  identifire: z.string(),
  password: z.string()
})
