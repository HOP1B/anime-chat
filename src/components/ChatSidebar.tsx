import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";
import { ImageDown } from "lucide-react";
import { SquarePen } from "lucide-react";
import { CharacterPanelProps } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useChatStore } from "@/lib/hooks/useChatStore";

const ChatSidebar = ({ name, img, description }: CharacterPanelProps) => {
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

      // Refresh the messages using react-query's invalidation
      if (refreshMessages) {
        await refreshMessages();
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <Card className="w-64 shadow-lg border-0 rounded-none flex flex-col">
        <CardHeader>
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={img}
                alt={name}
                className="object-cover"
              ></AvatarImage>
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-col">
                <p>{name}</p>
                <p className="text-[#666666]">by admin</p>
              </div>
            </div>
          </div>
          <CardTitle className="flex flex-col border-b">
            <div className="flex m-2 justify-between ">
              <div className="border p-2 rounded-full w-10 h-10 flex items-center justify-center hover:cursor-pointer">
                <ImageDown />
              </div>
              <div className="border p-2 rounded-full w-10 h-10  flex items-center justify-center hover:cursor-pointer">
                <Flag />
              </div>
            </div>
            <p className="font-extralight text-xs text-gray-700 mb-2">
              {description}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1">
          <div className="flex gap-2 flex-col">
            <Button
              className="w-32 rounded-3xl h-10"
              variant="secondary"
              onClick={deleteAllMessagesExceptFirst}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                <SquarePen className="mr-2" size={16} />
              )}
              New Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSidebar;
