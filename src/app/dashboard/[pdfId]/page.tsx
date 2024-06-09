import MaxWidthWraapper from "@/components/MaxWidthWraapper"
import PdfRenderer from "@/components/PdfRenderer"
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"
import prisma from "../../../../prisma"
import ChatWrapper from "@/components/chat/ChatWrapper"
import { authOptions } from "@/lib/authOptions";



async function page ({ params }: { params: { pdfId: string } }) {

    const session = await getServerSession(authOptions)
    const callback = `/auth-callback?origin=dashboard/${params.pdfId}`
    if(!session?.user || !session.user.email){
        redirect(callback)
    }

    const file = await prisma.file.findFirst({where:{id:params.pdfId }})

    if(!file){
        // console.log(params.pdfId)
        // console.log(file)
       /// use id not key
       notFound()
    }



    return (
        <MaxWidthWraapper className="bg-white border-gray-500 border-2 md:p-1  rounded-2xl h-[calc(100vh-3rem)] mb-7  items-center p-5">

            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px]  rounded-lg border"
            >
                <ResizablePanel minSize={25} defaultSize={50}>
                    <PdfRenderer url={file.url} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel   minSize={35} defaultSize={50}>
                    <ChatWrapper fileId={file.id} />
                </ResizablePanel>
            </ResizablePanelGroup>



        </MaxWidthWraapper>

    )
}

export default page