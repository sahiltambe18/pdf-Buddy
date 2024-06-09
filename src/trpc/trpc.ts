import { TRPCError, initTRPC } from '@trpc/server';
import { authOptions } from "@/lib/authOptions";
import { getServerSession  } from 'next-auth';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

const middleware = t.middleware

const isAuth = middleware( async(opts)=>{
    const session = await getServerSession(authOptions);

    if(!session || !session?.user?.email){
        throw new TRPCError({code:'UNAUTHORIZED'});
    }
        return opts.next({
            ctx:{
                email : session?.user?.email,
                user:session?.user
            }
        })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);