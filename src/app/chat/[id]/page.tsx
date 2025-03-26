"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/hooks/useChatStore";
import { useSession } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CharacterPanelProps, Message } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, LoaderCircle } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";
import Panel from "@/components/Panel";
import axios from "axios";

// Interface for ChatMessage props
interface ChatMessageProps {
  message: Message & { isLoading?: boolean };
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
  aiImage = "/asd.jpg",
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
          <AvatarImage
            src={aiImage || "/asd.jpg"}
            alt={aiName}
            className="object-cover"
          />
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
            <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">Thinking...</p>
          </div>
        ) : (
          <p className="text-base whitespace-pre-wrap">
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

// Updated ChatSidebar Component
const EnhancedChatSidebar = ({
  name,
  img,
  description,
}: CharacterPanelProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { refreshMessages } = useChatStore();

  const deleteAllMessagesExceptFirst = async () => {
    try {
      setIsDeleting(true);
      // Get conversation ID from URL
      const conversationId = window.location.pathname.split("/").pop();

      if (!conversationId) {
        console.error("No conversation ID found in URL");
        return;
      }

      // Make the API call
      await axios.delete("/api/chat", {
        data: { conversationId },
      });

      // Refresh the messages
      if (typeof refreshMessages === "function") {
        await refreshMessages();
      } else {
        // Fallback: refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Return the original ChatSidebar with the updated props
  return (
    <ChatSidebar
      name={name}
      img={img}
      description={description}
      deleteAllMessagesExceptFirst={deleteAllMessagesExceptFirst}
      isDeleting={isDeleting}
    />
  );
};

// Main Chat History Page Component
const ChatHistoryPage = () => {
  const { model, history, sendMessage, isLoading, isAiThinking } =
    useChatStore();
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Also use the scrollContainer method as backup
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim().length < 2) return;
    sendMessage(inputValue);
    setInputValue("");

    // Force immediate scroll to bottom on submit
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex">
      <Panel />
      <div className="h-screen w-full flex items-center text-black gap-2">
        <ScrollArea className="w-full h-screen" scrollHideDelay={0}>
          <div className="flex flex-col h-screen w-full items-center px-40">
            <div className="h-calc[100vh+40px] w-full flex flex-col items-center">
              <div className="mt-4 mb-10 flex flex-col items-center ">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={model?.imageUrl || "/asd.jpg"}
                    alt={model?.name}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {model?.nameOfChar?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-center mt-2 font-medium">
                  {model?.nameOfChar}
                </p>
                <p className="text-center max-w-md mt-2">
                  {model?.description}
                </p>
              </div>
              <div className="w-full px-4 flex-1 mb-20">
                <div className="pr-4" ref={scrollContainerRef}>
                  {!history || history.length === 0 ? (
                    <div className="flex h-64 w-full items-center justify-center">
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 pb-4">
                      {history.map((message, index) => (
                        <ChatMessage
                          key={message.id || index}
                          message={message}
                          userImage={session.session?.user.imageUrl}
                          userName={session.session?.user.firstName || "You"}
                          aiImage={model?.imageUrl || "/asd.jpg"}
                          aiName={model?.nameOfChar || "AI"}
                        />
                      ))}
                      {/* This invisible div will be used for scrolling to the bottom */}
                      <div ref={messageEndRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="fixed bottom-4 px-4 w-full max-w-3xl h-11">
              <div className="relative">
                <Input
                  className="rounded-full bg-gray-100 w-full h-11 pr-12 focus:outline-none"
                  placeholder={`Message to ${model?.nameOfChar || "AI"}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  className="rounded-full absolute right-1 bottom-1 top-1"
                  onClick={handleSubmit}
                  disabled={isLoading || inputValue.trim().length < 2}
                >
                  {isAiThinking ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  ) : (
                    <SendHorizontal />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="h-screen">
          <EnhancedChatSidebar
            name={model?.nameOfChar || "Unknown"}
            img={model?.imageUrl || "/asd.jpg"}
            description={model?.description || "Ready"}
            deleteAllMessagesExceptFirst={function (): Promise<void> {
              throw new Error("Function not implemented.");
            }}
            isDeleting={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPage;
