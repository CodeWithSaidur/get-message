import { connectDB } from '@/config/db'
import { UserModel } from '@/models/User.model'
import { usernameValidation } from '@/schemas/signup.schema'
import { NextRequest } from 'next/server'
import z from 'zod'

const UsernameQuerySchema = z.object({
  username: usernameValidation
})

export async function GET(req: NextRequest) {
  await connectDB()

  try {
    const searchParams = req.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return Response.json(
        {
          success: false,
          message: 'Username query parameter is required'
        },
        { status: 400 }
      )
    }

    // Validate username format
    const validationResult = UsernameQuerySchema.safeParse({ username })

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: validationResult.error.issues[0].message
        },
        { status: 400 }
      )
    }

    // Check if verified user with this username exists
    const existingUser = await UserModel.findOne({
      username: validationResult.data.username,
      isVerified: true
    })

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
          isUnique: false
        },
        { status: 200 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Username is available',
        isUnique: true
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking username uniqueness:', error)
    return Response.json(
      {
        success: false,
        message: 'Error checking username uniqueness'
      },
      { status: 500 }
    )
  }
}
