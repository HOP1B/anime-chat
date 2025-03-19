"use client";

import Image from "next/image";
import ChatSidebar from "@/components/ChatSidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useChatStore } from "@/lib/hooks/useChatStore";
import { CharacterPanelProps } from "@/lib/types";
import ChatHistoryPage from "@/components/Message";

const ChatSidePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { model, history, sendMessage, isLoading } = useChatStore();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim().length < 2) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Prepare props for ChatSidebar component
  const sidebarProps: CharacterPanelProps = {
    name: model?.nameOfChar || "Unknown",
    img: model?.imageUrl || "/asd.jpg",
    description: model?.description || "Ready",
  };

  return (
    <>
      <div className="h-screen w-full bg-[#ffffff] flex items-center text-black gap-2">
        <div className="h-screen w-full flex flex-col items-center pl-24">
          <div>
            <Image
              src={model?.imageUrl || "/asd.jpg"}
              alt={model?.nameOfChar || "AI Character"}
              width={80}
              height={10}
              className="rounded-full mt-32"
            />
            <p className="text-center mt-2 font-medium">{model?.nameOfChar}</p>
            <p className="text-center max-w-md mt-2">{model?.description}</p>
          </div>
          <ChatHistoryPage></ChatHistoryPage>
          <div className="text-[#666666] flex flex-col items-center">
            <div className="flex justify-center">
              <div className="fixed bottom-4 p-2">
                <Input
                  className="rounded-full bg-gray-100 w-[600px] h-11 relative focus:outline-none"
                  placeholder={`Message to ${model?.nameOfChar || "AI"}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  className="rounded-full absolute bottom-3 right-3"
                  onClick={handleSubmit}
                  disabled={isLoading || inputValue.trim().length < 2}
                >
                  <SendHorizontal />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ChatSidebar
          name={sidebarProps.name}
          img={sidebarProps.img}
          description={sidebarProps.description}
        />
      </div>
    </>
  );
};

export default ChatSidePage;
