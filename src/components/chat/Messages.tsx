import { trpc } from "@/app/_trpc/client"
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";
import { Skeleton } from "../ui/skeleton";


function Messages({ fileId }: { fileId: string }) {
  const {data , isLoading} = trpc.getFileMessages.useInfiniteQuery({ 
    fileId, 
    limit: 5
   },{
    getNextPageParam:(lastPage)=> lastPage?.nextCursor,
    placeholderData:keepPreviousData
   }
  );

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id:"loader-message",
    isUserMsg:false,
    text:(
      <span className="flex h-full justify-center items-center">
        <Loader2 className="h-4 animate-spin" />
      </span>
    )
  }

  const messages = data?.pages.flatMap((page)=> page.messages)

  const combinedMessages = [
    ...(true? [loadingMessage]: []),
    ...(messages ??  [])
  ];

  return (
    <div className="flex flex-col w-full overflow-y-auto gap-2">
      {
        combinedMessages && combinedMessages.length>0 ? (
          combinedMessages.map( (msg , i )=>{

            const isSamePerson = combinedMessages[i-1]?.isUserMsg === combinedMessages[i]?.isUserMsg

            if(i===combinedMessages.length-1){
              return <Message isSamePerson={isSamePerson} message={msg}  key={msg.id}/>
            }else{
              return <Message isSamePerson={isSamePerson} message={msg} key={msg.id} />
            }
          } )
        ):( isLoading ? (
        <div className="flex flex-col w-full gap-2">
          <Skeleton className="h-16" /> 
          <Skeleton className="h-16" /> 
          <Skeleton className="h-16" /> 
          <Skeleton className="h-16" /> 
        </div>):(
        <div className="flex-1 flex-col gap-2 flex  justify-center items-center">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl "> You$apos;re all set</h3> 
        </div>) )
      }
    </div>
  )
}

export default Messages