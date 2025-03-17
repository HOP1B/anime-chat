"use client";

import Image from "next/image";
import ChatSideFooter from "@/components/ChatFooter";
import ChatSidebar from "@/components/ChatSidebar";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { ModelType } from "@/lib/types";
import { useParams } from "next/navigation";

const ChatSidePage = () => {
  const session = useSession();
  const { id: conversationId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [history, setHistory] = useState<string | null>(null);
  const [model, setModel] = useState<ModelType | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchModel = async () => {
      try {
        const res = await axios.get(
          `/api/chat?conversationId=${conversationId}`
        );
        setModel(res.data.conversation.model);
      } catch (error) {
        console.error("Error fetching model:", error);
      }
    };
    fetchModel();
  }, [conversationId]);

  useEffect(() => {
    const fetchConversationId = async () => {
      const userId = await session.session?.user.id;
      if (!userId || !model?.name) return;

      try {
        const response = await axios.get(
          `/api/chat?userId=${userId}&modelName=${model.name}`
        );
        if (response.data?.history) {
          setHistory(response.data.history);
        }
      } catch (error) {
        console.error("Error fetching conversation ID:", error);
      }
    };

    fetchConversationId();
  }, [session.session?.user.id, model, conversationId]);

  return (
    <>
      <div className="h-screen w-full bg-[#fffff] flex items-center text-black gap-2 ">
        <div className="h-screen w-full flex flex-col items-center pl-24">
          <div>
            <Image
              src={model?.imageUrl || "/asd.jpg"}
              alt="Akeno Himejima"
              width={80}
              height={10}
              className="rounded-full mt-32"
            />
            <p>Akeno Himejima</p>
          </div>
          <div className="text-[#666666] flex flex-col items-center">
            <p>Priestess of Thunder and Lightning</p>
          </div>
          <ChatSideFooter name="Message Akeno Himejima..." />
        </div>
        <ChatSidebar
          name="Akeno Himejima"
          img="/akeno.jpeg"
          description="Priestess of Thunder and Lightning"
        />
      </div>
    </>
  );
};

export default ChatSidePage;
