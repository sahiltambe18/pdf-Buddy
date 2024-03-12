'use client'
import { useRouter , useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { signIn } from 'next-auth/react'

const page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

   const {data , error} =  trpc.authCallback.useQuery(undefined , {})
   
   if(error){
   
    signIn()
    router.refresh()
    //router.push("/sign-in", )
  }

  if(data?.success){
    router.push(origin? `/${origin}`:'/dashboard');
  }


  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default page