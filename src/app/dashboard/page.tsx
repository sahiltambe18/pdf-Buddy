import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await getServerSession(authOptions)
    if(!session?.user || !session.user.email) {
        redirect('/auth-callback?origin=dashboard');
    }
    
  return (
    <div>page</div>
  )
}

export default page