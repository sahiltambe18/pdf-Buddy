import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { inputValidator } from "@/lib/utils";
import prisma from "../../../../prisma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType , GoogleGenerativeAI } from "@google/generative-ai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export const POST =  async (req:NextRequest , res:NextResponse)=>{
     
    let body 
    await req.json()
     .then((data)=>{
        body = data
         console.log(data)
     })

    //  console.log(req.body)
    console.log(body)

    const session = await getServerSession(authOptions)

    const user = session?.user
    
    if(!user || !user.email) {
        return new Response("UNAUTHORISED",{status:401})
    }
    console.log(body)
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

    const User = await prisma.user.findFirst({where:{email:user.email}})

    if(!User) return new Response("NOT FOUND",{status:404});

    await prisma.message.create({
        data:{
            text:message,
            isUserMsg:true,
            fileId:fileId,
            userId:User.id
        }
    })


    const embeddings = new GoogleGenerativeAIEmbeddings({
        model:"embedding-001",
        apiKey:process.env.GOOGLE_API_KEY,
        taskType:TaskType.RETRIEVAL_DOCUMENT,
        title:file.name
      });

    const pineconeIdx = pinecone.Index("jarvis")

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{
        namespace:file.id,
        pineconeIndex:pineconeIdx
    })
    
    const result = await vectorStore.similaritySearch(message,4);
    
    const prevMessages = await prisma.message.findMany({
        where:{
            fileId:file.id
        },orderBy:{
            createdAt:"asc"
        },take:6
    });
    
    const formatedMsg = prevMessages.map( (msg)=>({
        role: msg.isUserMsg? "user" as const : "assistant" as const,
        content:msg.text
    }));
    
    const prompt = `The user asked: ${message}. 
    The document title is: ${file.name}. 
    The related pdf embedding: ${JSON.stringify({result})}
    the previous messages : ${JSON.stringify(formatedMsg)}
    `;
    // console.log("error up")

    const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

    const model = genAi.getGenerativeModel({model:"gemini-1.5-flash"});

    const modelResult = await model.generateContent(prompt);
    const response = await modelResult.response;
    const text = response.text();
    
    await prisma.message.create({data:{
        isUserMsg:false,
        text:text,
        fileId:fileId,
        userId:User.id
    }})

    // return  new NextResponse(JSON.stringify({ text }), { status: 200 });
    return  new Response(text , { status: 200 });
    // return  NextResponse.json(req.body)
};