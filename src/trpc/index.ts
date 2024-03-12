import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { publicProcedure, router } from './trpc';

import { TRPCError } from '@trpc/server';
import prisma from '../../prisma';
import { ConnectToDatabase } from '@/helpers/db';
import { randomUUID } from 'crypto';

export const appRouter = router({
  
  authCallback: publicProcedure.query(async () => {
    
    const session = await getServerSession(authOptions);
    
    
    
    if(!session || !session.user || !session.user.email ){
      
      throw new TRPCError({code:'UNAUTHORIZED'});
    }
    
    /// validate user
    
    try {
      await ConnectToDatabase()
      
      const dbUser = await prisma.user.findFirst({
        where:{
          email:session.user.email
        }});
        
        if(!dbUser){
          await prisma.user.create({data:{
            id: randomUUID(),
            email:session.user.email
          }})
        }

        return { success: true }

    } catch (error) {
      console.log(error)
    }finally{
      prisma.$disconnect
    }
    
  })
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;