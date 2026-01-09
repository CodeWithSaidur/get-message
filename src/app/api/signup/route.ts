import { connectDB } from '@/config/db'
import { UserModel } from '@/models/User.model'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'

export async function POST(req: Request) {
  await connectDB()

  try {
    const { username, email, password } = await req.json()

    const ExistingUserbyUsername = await UserModel.findOne({
      username,
      isVerified: true
    })

    if (ExistingUserbyUsername) {
      return Response.json(
        {
          success: false,
          message:
            'Error in Signup in Signup Username is Aldrady Taken route.ts'
        },
        {
          status: 500
        }
      )
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    const ExistingUserbyEmail = await UserModel.findOne({ email })
    if (ExistingUserbyEmail) {
      if (ExistingUserbyEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'Error in Signup in Signup Email is Aldrady Taken route.ts'
          },
          {
            status: 400
          }
        )
      } else {
        const hasedPassword = await bcrypt.hash(password, 13)
        ExistingUserbyEmail.password = hasedPassword
        ExistingUserbyEmail.verificationCode = verificationCode
        ExistingUserbyEmail.verificationCodeExpiry = new Date(
          Date.now() + 360000
        )
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 13)

      const expiyDate = new Date()
      expiyDate.setHours(expiyDate.getHours() + 1)

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verificationCode,
        verificationCodeExpiry: expiyDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      })

      await newUser.save()
    }

    // send Verification Email
    const emailRes = await sendVerificationEmail(
      email,
      username,
      verificationCode
    )

    if (!emailRes.success) {
      return Response.json(
        {
          success: false,
          message: 'Error from Respond Email Signup route.ts'
        },
        {
          status: 500
        }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'User register Successfully Verify OTP'
      },
      {
        status: 500
      }
    )
  } catch (error) {
    console.error('Error Registering User')
    return Response.json(
      {
        success: false,
        message: 'Error in Signup route.ts'
      },
      {
        status: 500
      }
    )
  }
}
