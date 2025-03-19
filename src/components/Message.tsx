"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useChatStore } from "@/lib/hooks/useChatStore";
import { useSession } from "@clerk/nextjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

const ChatHistoryPage = () => {
  const { history, model } = useChatStore();
  const session = useSession();
  const { id: conversationId } = useParams();

  if (!history || history.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-gray-500">No chat history available</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Image
            src={model?.imageUrl || "/asd.jpg"}
            alt={model?.nameOfChar || "AI"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-medium">{model?.nameOfChar || "Chat"}</h1>
        </div>
        <p className="text-sm text-gray-500">
          Conversation ID: {conversationId}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {history.map((message: Message, index: number) => (
            <div
              key={message.id || index}
              className={cn(
                "flex items-start gap-2",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              {message.role === "user" ? (
                <Avatar>
                  <AvatarImage
                    src={session.session?.user.imageUrl}
                    alt="User"
                  />
                  <AvatarFallback>
                    {session.session?.user.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage
                    src={model?.imageUrl}
                    alt={model?.nameOfChar || "AI"}
                  />
                  <AvatarFallback>
                    {model?.nameOfChar?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg p-3 max-w-md",
                  message.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100"
                )}
              >
                <p>{message.content}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistoryPage;
