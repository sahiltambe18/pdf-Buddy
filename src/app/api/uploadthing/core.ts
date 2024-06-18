import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../prisma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from '@langchain/pinecone'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'
import { authOptions } from "@/lib/authOptions";
 
const f = createUploadthing();
 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      if(!session?.user || !session.user.email){
        throw  new UploadThingError("Unauthorized");
      }
      const user = await prisma.user.findFirst({
        where:{
          email:session.user.email
        }
      })
      return { ...session.user, userId : user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      
      console.log("Upload complete for userId:", metadata);
 
      // console.log("file url", file.url);

      const savedFile = await prisma.file.create({
        data:{
          key:file.key,
          name:file.name,
          url : file.url,
          UploadStatus: 'PROCESSING',
          userId: metadata.userId
        }
      });

      try {
        const res = await fetch(file.url);

        const blob = await res.blob();

        const loader = new PDFLoader(blob)

        const pagesDoc = await loader.load();

        // vectorise pdf

        const pineconeIdx = pinecone.Index("jarvis")

        const embeddings = new GoogleGenerativeAIEmbeddings({
          model:"embedding-001",
          apiKey:process.env.GOOGLE_API_KEY,
          taskType:TaskType.RETRIEVAL_DOCUMENT,
          title:savedFile.name
        })

        // console.log("uploaded pending")
        const ress = await PineconeStore.fromDocuments(pagesDoc , embeddings , {
          pineconeIndex:pineconeIdx,
          namespace: savedFile.id
        });

        
          console.log("uploaded success")
          // console.log(ress)
        
        await prisma.file.update({data:{
          UploadStatus:"SUCCESS"
        },where:{
          id:savedFile.id
        }});

      } catch (error) {

        console.log("embedding failed")
        console.log(error)
        await prisma.file.update({data:{
          UploadStatus:"FAILED"
        },where:{
          id:savedFile.id
        }});
      }

      
 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;