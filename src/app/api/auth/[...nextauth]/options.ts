import { NextAuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/config/db'
import { UserModel } from '@/models/User.model'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { User } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'Credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(
        credentials: { identifier?: string; password?: string } | undefined,
        req: any
      ): Promise<User | null> {
        if (!credentials?.identifier || !credentials?.password) return null

        try {
          await connectDB()
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          }).select('+password')

          if (!user || !user.password) return null

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )
          if (!isPasswordValid) return null

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    strategy: 'jwt'
  }
}
