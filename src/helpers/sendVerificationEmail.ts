import { resend } from '@/lib/resend'
import { EmailTemplate } from '@/components/email-template'
import { ApiResponse } from '@/types/ApiResponce'

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Original Domain Verify
      to: email,
      subject: 'Verification Code',
      react: EmailTemplate({ username, otp })
    })

    return {
      success: true,
      message: 'Email Send Successfully'
    }
  } catch (error) {
    console.error('Error sending Failed', error)
    return {
      success: false,
      message: 'Email sending Failed',
      fileName: 'sendVerificationEmail.ts'
    }
  }
}
