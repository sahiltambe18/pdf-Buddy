import { trpc } from "@/app/_trpc/client"


function Message({fileId}:{fileId:string}) {
  const messages = trpc.getFileMessages.useQuery({fileId,limit:5});
  return (
    <div>{JSON.stringify(messages)}</div>
  )
}

export default Message