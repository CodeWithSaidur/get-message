import { z } from 'zod'

export const usernameValidation = z
  .string()
  .min(3, 'Username must be at least 3 letters')
  .max(16, 'Username cannot be more than 16 letters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
})

export type SignupInput = z.infer<typeof signupSchema>
