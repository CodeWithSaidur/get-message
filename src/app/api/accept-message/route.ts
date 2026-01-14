import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import { connectDB } from '@/config/db'
import { UserModel } from '@/models/User.model'
import { User } from 'next-auth'

export async function POST(req: Request) {
  await connectDB()

  const session = await getServerSession(authOptions)
  const user = session?.user as User

  if (!session || !user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = user._id
  const { acceptMessage } = await req.json()

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessage: acceptMessage },
      { new: true }
    )

    if (!updatedUser) {
      return new Response('User not found', { status: 404 })
    }

    return new Response('User updated successfully', { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return new Response('Error updating user', { status: 500 })
  }
}

export async function GET(req: Request) {
  await connectDB()

  const session = await getServerSession(authOptions)
  const user = session?.user as User

  if (!session || !user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = user._id

  try {
    const user = await UserModel.findOne({ _id: userId })

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    return new Response(JSON.stringify(user), { status: 200 })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return new Response('Error fetching user', { status: 500 })
  }
}
