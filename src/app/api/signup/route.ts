import { connectDB } from '@/config/db'
import { UserModel } from '@/models/User.model'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/resend-smtp'

export async function POST(req: Request) {
  await connectDB()

  try {
    const { username, email, password } = await req.json()

    // Validate input
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: 'Missing required fields'
        },
        { status: 400 }
      )
    }

    // Check if verified user with this username exists
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })

    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken'
        },
        { status: 400 }
      )
    }

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    // Set expiry to 1 hour from now
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user with this email exists
    const existingUserByEmail = await UserModel.findOne({ email })

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'Email is already registered Change Email'
          },
          { status: 400 }
        )
      } else {
        // Update existing i.e unverified user
        existingUserByEmail.username = username
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verificationCode = verificationCode
        existingUserByEmail.verificationCodeExpiry = expiryDate
        await existingUserByEmail.save()
      }
    } else {
      // Create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      })

      await newUser.save()
    }

    // Send verification email
    const emailRes = await sendVerificationEmail(email,username,verificationCode)
    console.log(emailRes);
    
    if (!emailRes.success) {
      return Response.json(
        {
          success: false,
          message: 'Failed to send verification email'
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering user:', error)
    return Response.json(
      {
        success: false,
        message: 'Error registering user'
      },
      { status: 500 }
    )
  }
}
