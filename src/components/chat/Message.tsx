import { cn } from "@/lib/utils"
import { ExtendedMessages } from "@/types/message"
import { Icons } from "../Icon"
import ReactMarkdown from 'react-markdown';


interface MessageProps {
  message: ExtendedMessages,
  isSamePerson: boolean
}

function Message({
  message, isSamePerson
}: MessageProps) {

  return (
    <div className={cn("flex ", {
      "self-start":!message.isUserMsg,
      "self-end":message.isUserMsg,
      "flex-row-reverse":message.isUserMsg
    })}>
      <div className={cn(
        'relative flex h-6 w-6 aspect-square items-center justify-center',
        {
          'bg-blue-600 rounded-sm':
            message.isUserMsg,
          ' bg-zinc-800 rounded-sm':
            !message.isUserMsg,
          invisible: isSamePerson,
        }
      )}>
        {message.isUserMsg ? (
          <Icons.user className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4' />
        ) : (
          <Icons.logo className='fill-zinc-300 h-3/4 w-3/4' />
        )}
      </div>
      <div
        className={cn(
          'px-4 py-2 rounded-lg  max-w-3/5 w-auto inline-block',
          {
            'bg-blue-600 text-white':
              message.isUserMsg,
            'bg-gray-200 text-gray-900':
              !message.isUserMsg
          }
        )}>
        {typeof message.text === 'string' ? (
          <ReactMarkdown
            className={cn('max-w-prose', {
              'text-zinc-50': message.isUserMsg,
            })}>
            {message.text}
          </ReactMarkdown>
        ) : (
          message.text
        )}
        {message.id !== 'loader-message' ? (
          <div
            className={cn(
              'text-xs select-none mt-2 w-full text-right',
              {
                'text-zinc-500': !message.isUserMsg,
                'text-blue-300': message.isUserMsg,
              }
            )}>
            {
              new Date(message.createdAt).toTimeString().slice(0, 5)
            }
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Message