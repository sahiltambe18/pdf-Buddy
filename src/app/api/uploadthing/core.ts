import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "../../../../prisma";
 
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
 
      console.log("file url", file.url);

      await prisma.file.create({
        data:{
          key:file.key,
          name:file.name,
          url : file.url,
          UploadStatus: 'PROCESSING',
          userId: metadata.userId
        }
      })
 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;