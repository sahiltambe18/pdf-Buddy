import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { getUser } from '@/helpers/tools'
import Dashboard from '@/components/Dashboard'
import { authOptions } from "@/lib/authOptions";

const page = async () => {
    const session = await getServerSession(authOptions)
    const callback = '/auth-callback?origin=dashboard';
    // console.log(session);
    if(!session?.user || !session.user.email) {
        redirect(callback);
    }

    const user = await getUser(session.user.email);
    
  return (
    <Dashboard/>
  )
}

export default page