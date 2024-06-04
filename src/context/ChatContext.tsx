import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import { ReactNode, createContext, useRef, useState } from "react";

type chatContextProps = {
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    addMessage: () => void,
    message: string
    isLoading: boolean
}

export const ChatContext = createContext<chatContextProps>({
    handleChange: () => { },
    addMessage: () => { },
    message: "",
    isLoading: false
})

export const ChatContextProvider = ({
    fileId,
    children,
  }: {fileId:string , children:ReactNode}) => {
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
    const utils = trpc.useContext()
  
    const { toast } = useToast()
  
    const backupMessage = useRef('')
  
    const { mutate: sendMessage } = useMutation({
      mutationFn: async ({
        message,
      }: {
        message: string
      }) => {
        const response = await fetch('/api/message', {
          method: 'POST',
          body: JSON.stringify({
            fileId,
            message,
          }),
        })
  
        if (!response.ok) {
          throw new Error('Failed to send message')
        }
  
        return response.body
      },
      onMutate: async ({ message }) => {
        backupMessage.current = message
        setMessage('')
  
        // step 1
        await utils.getFileMessages.cancel()
  
        // step 2
        const previousMessages =
          utils.getFileMessages.getInfiniteData()
  
        // step 3
        utils.getFileMessages.setInfiniteData(
          { fileId, limit: MAX_MESSAGE_LIMIT },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              }
            }
  
            let newPages = [...old.pages]
  
            let latestPage = newPages[0]!
  
            latestPage.messages = [
              {
                createdAt: new Date().toISOString(),
                id: crypto.randomUUID(),
                text: message,
                isUserMsg: true,
              },
              ...latestPage.messages,
            ]
  
            newPages[0] = latestPage
  
            return {
              ...old,
              pages: newPages,
            }
          }
        )
  
        setIsLoading(true)
  
        return {
          previousMessages:
            previousMessages?.pages.flatMap(
              (page) => page.messages
            ) ?? [],
        }
      },
      onSuccess: async (stream) => {
        setIsLoading(false)
  
        if (!stream) {
          return toast({
            title: 'There was a problem sending this message',
            description:
              'Please refresh this page and try again',
            variant: 'destructive',
          })
        }
  
        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let done = false
  
        // accumulated response
        let accResponse = ''
  
        while (!done) {
          const { value, done: doneReading } =
            await reader.read()
          done = doneReading
          const chunkValue = decoder.decode(value)
  
          accResponse += chunkValue
  
          // append chunk to the actual message
          utils.getFileMessages.setInfiniteData(
            { fileId, limit: MAX_MESSAGE_LIMIT },
            (old) => {
                
              if (!old) return { pages: [], pageParams: [] }
  
              let isAiResponseCreated = old.pages.some(
                (page) =>
                  page.messages.some(
                    (message) => message.id === 'ai-response'
                  )
              )
  
              let updatedPages = old.pages.map((page) => {
                if (page === old.pages[0]) {
                  let updatedMessages
  
                  if (!isAiResponseCreated) {
                    updatedMessages = [
                      {
                        createdAt: new Date().toISOString(),
                        id: 'ai-response',
                        text: accResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ]
                  } else {
                    updatedMessages = page.messages.map(
                      (message) => {
                        if (message.id === 'ai-response') {
                          return {
                            ...message,
                            text: accResponse,
                          }
                        }
                        return message
                      }
                    )
                  }
  
                  return {
                    ...page,
                    messages: updatedMessages,
                  }
                }
  
                return page
              })
  
              return { ...old, pages: updatedPages }
            }
          )
        }
      },
  
      onError: (_, __, context) => {
        setMessage(backupMessage.current)
        utils.getFileMessages.setData(
          { fileId },
          { messages: context?.previousMessages ?? [] }
        )
      },
      onSettled: async () => {
        setIsLoading(false)
  
        await utils.getFileMessages.invalidate({ fileId })
      },
    })
  
    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setMessage(e.target.value)
    }
  
    const addMessage = () => sendMessage({ message })
  
    return (
      <ChatContext.Provider
        value={{
          addMessage,
          message,
          handleChange,
          isLoading,
        }}>
        {children}
      </ChatContext.Provider>
    )
  }