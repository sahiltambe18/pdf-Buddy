import { Send } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { ChatContext } from "@/context/ChatContext"
import { useContext, useRef } from "react"


interface props {
  isDisabled: boolean
}


export default function ChatInput({ isDisabled }: props) {
  const {addMessage,handleChange,isLoading,  message} = useContext(ChatContext)

  const TextAreaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <div className="absolute bottom-0 left-0 w-full ">
      <div className="mx-2 flex flex-row gap-2 md:mx-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl" >
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-3 shadow-lg ">
            <div className="relative">
              <Textarea 
              ref={TextAreaRef}
              placeholder="Ask Your Question" 
              autoFocus
              className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
              rows={1} 
              onChange={handleChange}
              value={message}
              onKeyDown={(e)=>{
                if(e.key==="Enter" && !e.shiftKey){
                  e.preventDefault()
                  addMessage({message})
                  TextAreaRef.current?.focus()
                }
              }}
              maxRows={4} />
              <Button 
              disabled={isLoading}
              className="absolute bottom-1.5 hover:bg-none hover:text-white right-1.5 bg-transparent"
              aria-label="Send Message"
              onClick={(e)=>{
                e.preventDefault()
                addMessage({message})
              }}
              
              >
                
                <Send className="w-5 h-6 hover:text-white text-[#884dee]"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}