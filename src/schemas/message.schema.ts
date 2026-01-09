import { z } from 'zod'

export const messageSchima = z.object({
  message: z
    .string()
    .min(10, { message: 'Message must be atlist 10 Charrecter' })
    .max(300, { message: 'Message must be not  be more then 300 Charrecter' })
})
