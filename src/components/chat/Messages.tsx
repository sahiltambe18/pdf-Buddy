import { useEffect, useMemo, useRef, useContext } from "react";
import { trpc } from "@/app/_trpc/client";
import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";
import { Skeleton } from "../ui/skeleton";
import { ChatContext } from "@/context/ChatContext";

function Messages({ fileId }: { fileId: string }) {
  const { data, isLoading: trpcLoading } = trpc.getFileMessages.useInfiniteQuery(
    { fileId, limit: 5 },
    {
      refetchInterval(data, query) {
        return data ? false : 2000;
      },
    }
  );

  const {
    isLoading: contextLoading,
    messages: combinedMessages,
    setPrevMsg,
  } = useContext(ChatContext);

  const loadingMessage = useMemo(() => ({
    createdAt: new Date().toISOString(),
    id: "loader-message",
    isUserMsg: false,
    text: (
      <span className="flex h-full justify-center items-center">
        <Loader2 className="h-4 animate-spin" />
      </span>
    )
  }), []);

  const LoadedMessages = useMemo(() => data?.pages.flatMap(page => page.messages), [data]);

  const CombinedMessages = useMemo(() => {
    // Filter out loader-message if it exists
    const filteredMessages = (LoadedMessages ?? []).filter(msg => msg.id !== 'loader-message');
    return [
      ...(contextLoading ? [loadingMessage] : []),
      ...filteredMessages
    ];
  }, [contextLoading, LoadedMessages, loadingMessage]);

  useEffect(() => {
    if (combinedMessages.length === 0 && CombinedMessages.length > 0) {
      setPrevMsg(CombinedMessages);
    }
  }, [combinedMessages, CombinedMessages, setPrevMsg]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [CombinedMessages]);

  return (
    <div className="flex flex-col w-full overflow-y-auto gap-2 pb-24 hide-scrollbar">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((msg, i) => {
          const isSamePerson = combinedMessages[i - 1]?.isUserMsg === combinedMessages[i]?.isUserMsg;
          return <Message key={msg.id} message={msg} isSamePerson={isSamePerson} />;
        })
      ) : (
        trpcLoading ? (
          <div className="flex flex-col w-full gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="flex-1 flex-col gap-2 flex justify-center items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h3 className="font-semibold text-xl">You&apos;re all set</h3>
          </div>
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages;
