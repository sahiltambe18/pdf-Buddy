import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { ExtendedMessages } from "@/types/message";
import { useMutation } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import { Loader2 } from "lucide-react";
import { ReactNode, createContext, useState, useCallback } from "react";

type chatContextProps = {
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addMessage: ({ message }: { message: string }) => void;
  setPrevMsg: (msgs: ExtendedMessages) => void;
  message: string;
  messages: ExtendedMessages;
  isLoading: boolean;
};

export const ChatContext = createContext<chatContextProps>({
  handleChange: () => {},
  addMessage: () => {},
  setPrevMsg: () => {},
  message: "",
  messages: [],
  isLoading: false,
});

export const ChatContextProvider = ({
  fileId,
  children,
}: { fileId: string; children: ReactNode }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ExtendedMessages>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const setPrevMsg = useCallback((msgs: ExtendedMessages) => {
    setMessages(msgs);
  }, []);

  const addMessage = useCallback(
    async ({ message }: { message: string }) => {
      setMessage("")
      setIsLoading(true);
      const newMessage = {
        createdAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        isUserMsg: true,
        text: message,
      };
      setMessages((prev) => [...prev, newMessage]);

      try {
        const res = await fetch("/api/messages/", {
          body: JSON.stringify({
            fileId,
            message,
          }),
          method: "POST",
        });

        if (!res.ok) {
          throw new Error("Could not fetch response");
        }

        const loadingMsg = {
          createdAt: new Date().toISOString(),
          id: "loader-message",
          isUserMsg: false,
          text: (
            <span className="flex h-full justify-center items-center">
              <Loader2 className="h-4 animate-spin" />
            </span>
          )
        }

        setMessages((prev)=> {
          return [...prev,loadingMsg]
        });


        const data = await res.text();
        setMessages(prev => [...prev,{
          createdAt:new Date().toISOString(),
          id:crypto.randomUUID(),
          isUserMsg:false,
          text:data
        }]);
        // console.log(data)
      } catch (error) {
        console.error(error);
      } finally {
        setMessages((prev)=>{
          return prev.filter( msg => msg.id!=="loader-message")
        })
        setIsLoading(false);
      }
    },
    [fileId]
  );

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleChange,
        setPrevMsg,
        messages,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

