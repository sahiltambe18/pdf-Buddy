import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";

import { privateProcedure, publicProcedure, router  } from './trpc';

import { TRPCError } from '@trpc/server';
import prisma from '../../prisma';
import { ConnectToDatabase } from '@/helpers/db';
import { randomUUID } from 'crypto';
import { z } from 'zod'
import { getNamedRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex';

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
    
  }),

  getUserFiles: privateProcedure.query( async ({ctx})=>{
    const {user , email} = ctx;

    return await prisma.file.findMany({
      where:{
        User:{
          email:email
        }
      }
    });

  }),
  deleteFile: privateProcedure.input(z.object({
    id:z.string()
  }) ).mutation( async({ctx , input})=>{
    const {email , user} = ctx;
    const file = await prisma.file.findFirst({
      where:{
        id:input.id,
        User:{
          email:email
        }
      }
    });

    if(!file){
      throw new TRPCError({code:'NOT_FOUND'});
    }  
    
    const res = await prisma.file.delete({where:{id:input.id }})

    return res;
    
  }),
  getFile: privateProcedure
    .input(z.object({key:z.string()}))
    .mutation(async({ctx,input})=>{
      const {  email} = ctx;
      const file = await prisma.file.findFirst({ where:{
        key:input.key,
        User:{
          email:email
        }
      }});

      if(!file){
        throw new TRPCError({code:"NOT_FOUND"})
      }

      return file;
    }),
    
    getFileMessages: privateProcedure.input(z.object({fileId:z.string(), cursor:z.string().nullish() , limit:z.number().min(1).max(20 ).nullish().default(10)}))
    .query(async({ctx , input})=>{
      const {email} = ctx;
      const {fileId , cursor,limit} = input;
      const User = await prisma.user.findFirst({where:{email}});
      const file = await prisma.file.findFirst({where:{
        id:fileId,
        userId:User?.id
      }});
      if(!file || !User) throw new TRPCError({code:'NOT_FOUND'});

      const messages = await prisma.message.findMany({
        cursor:cursor ? {id:cursor}:undefined,
        // take:limit? limit+1 : 5,
        where:{
          fileId,
          userId:User.id
        },select:{
          createdAt:true,
          isUserMsg:true,
          id:true,
          text:true,
        },
        orderBy:{
          createdAt:'desc'
        }
      });
      let nextCursor : typeof cursor| undefined = undefined;

      if(messages.length>0){
        const lastMessage = messages.pop();
        nextCursor  = lastMessage?.id;
      }
      messages.reverse()

      return {
        messages,
        nextCursor
      }
    })
    ,

    getFileStatus: privateProcedure.input(z.object({ fileId: z.string()}))
    .query(async({ctx , input})=>{
      const file = await prisma.file.findFirst({where:{
        id:input.fileId,  
   }});

   if (!file) return { status: 'PENDING' }

   return { status: file.UploadStatus}
    })

  })

 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;