"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { Message, ModelType } from "@/lib/types";

// Custom hook for chat functionality with TanStack Query
export const useChatStore = () => {
  const { id: conversationId } = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = session.session?.user.id;

  // Fetch conversation model details and messages
  const { data: conversationData, isLoading: isConversationLoading } = useQuery(
    {
      queryKey: ["conversation", conversationId],
      queryFn: async () => {
        if (!conversationId) return null;
        const res = await axios.get(
          `/api/chat?conversationId=${conversationId}`
        );
        return res.data;
      },
      enabled: !!conversationId,
    }
  );

  // Fetch user conversations for a specific model
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: userModelData } = useQuery({
    queryKey: [
      "userModelData",
      userId,
      conversationData?.conversation?.model?.name,
    ],
    queryFn: async () => {
      if (!userId || !conversationData?.conversation?.model?.name) return null;
      const res = await axios.get(
        `/api/chat?userId=${userId}&modelName=${conversationData.conversation.model.name}`
      );
      return res.data;
    },
    enabled:
      !!userId &&
      !!conversationData?.conversation?.model?.name &&
      !!conversationId,
  });

  // Fetch available conversations
  const { data: conversationsData } = useQuery({
    queryKey: [
      "conversations",
      userId,
      conversationData?.conversation?.model?.name,
    ],
    queryFn: async () => {
      if (!userId || !conversationData?.conversation?.model?.name)
        return { conversations: [] };
      const res = await axios.get(
        `/api/chat?userId=${userId}&modelName=${conversationData.conversation.model.name}`
      );
      return {
        conversations: res.data.conversations || [],
      };
    },
    enabled:
      !!userId &&
      !!conversationData?.conversation?.model?.name &&
      !!conversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (message.length < 2) throw new Error("Message too short");

      return axios.post("/api/chat", {
        prompt: message,
        userId: userId,
        modelName: conversationData?.conversation?.model?.name,
        conversationId: conversationId,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch conversation data after sending a message
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    },
  });

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (modelName: string) => {
      if (!userId) throw new Error("User not authenticated");

      const response = await axios.post("/api/chat", {
        prompt: "Hello",
        userId: userId,
        modelName: modelName,
      });

      return response.data;
    },
    onSuccess: (data) => {
      // Navigate to the new conversation
      router.push(`/chat/${data.conversationId}`);
    },
  });

  return {
    model: conversationData?.conversation?.model as ModelType | undefined,
    history: conversationData?.history as Message[] | undefined,
    conversations: conversationsData?.conversations || [],
    sendMessage: (message: string) => sendMessageMutation.mutate(message),
    createNewConversation: (modelName: string) =>
      createConversationMutation.mutate(modelName),
    isLoading: sendMessageMutation.isPending || isConversationLoading,
  };
};
