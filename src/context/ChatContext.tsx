import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useState } from "react";

type chatContextProps = {
    handleChange:(event:React.ChangeEvent<HTMLTextAreaElement>)=> void
    addMessage:()=> void,
    message:string
    isLoading: boolean
}

export const  ChatContext= createContext<chatContextProps>({
    handleChange:()=>{},
    addMessage: ()=>{},
    message:"",
    isLoading:false
})

export const ChatContextProvider = ({fileId, children}:{fileId:string , children:ReactNode})=>{
    const [ message , setMessage] = useState<string>("")

    const {toast} = useToast()
    const [isLoading , setIsLoading] = useState<boolean>(false)
    const {mutate:sendMessage} = useMutation({
        mutationFn: async (message:string)=>{
            const resposnse = await fetch("/api/messages",{
                method:"POST",
                body: JSON.stringify({
                    fileId,
                    message
                }),

            });

            if(!resposnse.ok) throw Error("Failed to send message")

            return resposnse.body
        }
    })

    const addMessage = ()=> sendMessage(message)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setMessage(e.target.value)
    }

    return <ChatContext.Provider value={{
        addMessage,
        handleChange,
        isLoading,
        message
    }} >
        {children}
    </ChatContext.Provider>
}