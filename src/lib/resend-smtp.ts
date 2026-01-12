import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'
import { ApiResponse } from '@/types/ApiResponse'

// Validate API key at module load
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Validate inputs
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Invalid email address'
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Verification Code',
      react: EmailTemplate({ username, verifyCode })
    })

    if (error) {
      console.error('Resend API error:', error)
      return {
        success: false,
        message: error.message || 'Email sending failed',
        fileName: 'sendVerificationEmail.ts'
      }
    }

    return {
      success: true,
      message: 'Email sent successfully'
    }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Email sending failed',
      fileName: 'sendVerificationEmail.ts'
    }
  }
}