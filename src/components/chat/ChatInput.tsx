import { Send } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"


interface props {
  isDisabled: boolean
}

export default function ChatInput({ isDisabled }: props) {
  return (
    <div className="absolute bottom-0 left-0 w-full ">
      <form className="mx-2 flex flex-row gap-2 md:mx-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl" >
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-3 ">
            <div className="relative">
              <Textarea 
              placeholder="Ask Your Question" 
              autoFocus
              className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
              rows={1} 
              maxRows={4} />
              <Button 
              className="absolute bottom-1.5 hover:bg-none hover:text-white right-1.5 bg-transparent"
              aria-label="Send Message"
              >
                <Send className="w-5 h-6 hover:text-white text-[#884dee]"/>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}