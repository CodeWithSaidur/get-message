import * as React from 'react'

interface EmailTemplateProps {
  username: string
  verifyCode: string
}

export function EmailTemplate({ username, verifyCode }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <span>Your VERIFYCODE {verifyCode}</span>
    </div>
  )
}
