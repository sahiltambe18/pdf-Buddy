import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { inputValidator } from "@/lib/utils";
import prisma from "../../../../prisma";

export const Post = async (req:NextRequest)=>{
    await req.json()

    const body = req.body

    const session = await getServerSession(authOptions)

    const user = session?.user
    
    if(!user || !user.email) {
        return new Response("UNAUTHORISED",{status:401})
    }

    const {fileId,message} = inputValidator.parse(body)

    const file = await prisma.file.findFirst({where:{
        id:fileId,
        User:{
            email:user.email
        }
    }});

    if(!file) {
        return new Response("NOT FOUND", {status:404});
    }

    


}