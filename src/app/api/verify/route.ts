import { connectDB } from '@/config/db'
import { UserModel } from '@/models/User.model'

export async function POST(request: Request) {
  await connectDB()

  try {
    const { username, verificationCode } = await request.json()

    if (!username || !verificationCode) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const decodedUser = decodeURIComponent(username)

    const user = await UserModel.findOne({ username: decodedUser })
    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const isCodeExpired =
      user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry
    const isValidCode = user.verificationCode === verificationCode

    if (!isValidCode || isCodeExpired) {
      return Response.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    user.isVerified = true
    await user.save()

    return Response.json(
      { success: true, message: 'User verified successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying user:', error)
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
