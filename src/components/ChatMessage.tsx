"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  userImage?: string;
  userName?: string;
  aiImage?: string;
  aiName?: string;
}

// Chat Message Component
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userImage,
  userName = "You",
  aiImage,
  aiName = "AI",
}) => {
  const isUser = message.role === "user";
  const isLoading = "isLoading" in message ? message.isLoading : false;

  return (
    <div
      className={cn("flex items-start gap-2", isUser ? "flex-row-reverse" : "")}
    >
      {isUser ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8">
          <AvatarImage src={aiImage} alt={aiName} />
          <AvatarFallback>{aiName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-lg p-3 max-w-md",
          message.role === "model" ? "bg-blue-100 text-blue-900" : "bg-gray-100"
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">Thinking...</p>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">
            {message.content || message.text}
          </p>
        )}
        {message.createdAt && !isLoading && (
          <p className="mt-1 text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
};
export default ChatMessage;
