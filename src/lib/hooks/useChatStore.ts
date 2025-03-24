"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { Message, ModelType } from "@/lib/types";
import { useState } from "react";

// Define types for API responses and data structures
type ConversationResponse = {
  conversation: {
    id: string;
    messages: Message[];
    model: ModelType;
    modelId: string;
  };
};

type MessageResponse = {
  text: string;
  conversationId: string;
};

type NewConversationResponse = {
  conversationId: string;
  text: string;
};

type UserModelResponse = {
  history: Message[];
  conversationId: string;
  model: ModelType;
  conversations?: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

type MutationContext = {
  previousData: unknown;
};

// Extend Message type to include isLoading property for AI messages
type MessageWithLoading = Message & {
  isLoading?: boolean;
};

// Custom hook for chat functionality with TanStack Query
export const useChatStore = () => {
  const { id: conversationId } = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = session.session?.user.id;
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Fetch conversation model details and messages
  const { data: conversationData, isLoading: isConversationLoading } =
    useQuery<ConversationResponse>({
      queryKey: ["conversation", conversationId],
      queryFn: async () => {
        if (!conversationId) throw new Error("No conversation ID provided");
        const res = await axios.get(
          `/api/chat?conversationId=${conversationId}`
        );
        return res.data;
      },
      enabled: !!conversationId,
    });

  // Fetch user conversations for a specific model
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: userModelData } = useQuery<UserModelResponse>({
    queryKey: [
      "userModelData",
      userId,
      conversationData?.conversation?.model?.name,
    ],
    queryFn: async () => {
      if (!userId || !conversationData?.conversation?.model?.name)
        throw new Error("Missing user or model data");

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
  const { data: conversationsData } = useQuery<{
    conversations: Array<{ id: string; createdAt: string; updatedAt: string }>;
    history: Message[];
  }>({
    queryKey: [
      "conversations",
      userId,
      conversationData?.conversation?.model?.name,
    ],
    queryFn: async () => {
      if (!userId || !conversationData?.conversation?.model?.name)
        return { conversations: [], history: [] };

      const res = await axios.get(
        `/api/chat?userId=${userId}&modelName=${conversationData.conversation.model.name}`
      );

      return {
        conversations: res.data.conversations || [],
        history: res.data.history || [],
      };
    },
    enabled:
      !!userId &&
      !!conversationData?.conversation?.model?.name &&
      !!conversationId,
  });

  // Send message mutation with optimistic updates
  const sendMessageMutation = useMutation<
    MessageResponse,
    Error,
    string,
    MutationContext
  >({
    mutationFn: async (userMessage: string) => {
      if (userMessage.length < 2) throw new Error("Message too short");

      setIsAiThinking(true);

      const response = await axios.post<MessageResponse>("/api/chat", {
        prompt: userMessage,
        userId,
        modelName: conversationData?.conversation?.model?.name,
        conversationId,
      });

      return response.data;
    },
    onMutate: async (userMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["conversation", conversationId],
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<ConversationResponse>([
        "conversation",
        conversationId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<ConversationResponse | undefined>(
        ["conversation", conversationId],
        (old) => {
          if (!old) return undefined;

          // Create a temporary user message
          const tempUserMessage: Message = {
            id: `temp-user-${Date.now()}`,
            role: "user",
            text: userMessage,
            content: userMessage,
            createdAt: new Date().toISOString(),
          };

          // Create a temporary loading AI message
          const tempAiMessage: MessageWithLoading = {
            id: `temp-ai-${Date.now()}`,
            role: "model",
            text: "...",
            content: "...",
            isLoading: true,
            createdAt: new Date().toISOString(),
          };

          return {
            ...old,
            conversation: {
              ...old.conversation,
              messages: [
                ...old.conversation.messages,
                tempUserMessage,
                tempAiMessage,
              ],
            },
          };
        }
      );

      return { previousData };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data, _userMessage, context) => {
      setIsAiThinking(false);

      // Update with the real AI response
      queryClient.setQueryData<ConversationResponse | undefined>(
        ["conversation", conversationId],
        (old) => {
          if (!old) return undefined;

          // Get all messages except the last one (which is our loading message)
          const messagesWithoutLoading = old.conversation.messages.slice(0, -1);

          // Create the real AI message with the response text
          const realAiMessage: Message = {
            id: `ai-${Date.now()}`,
            role: "model",
            text: data.text,
            content: data.text,
            createdAt: new Date().toISOString(),
          };

          return {
            ...old,
            conversation: {
              ...old.conversation,
              messages: [...messagesWithoutLoading, realAiMessage],
            },
          };
        }
      );
    },
    onError: (_error, _userMessage, context) => {
      setIsAiThinking(false);

      // If the mutation fails, use the context we saved to roll back
      if (context?.previousData) {
        queryClient.setQueryData(
          ["conversation", conversationId],
          context.previousData
        );
      }

      console.error("Error sending message");
    },
    onSettled: () => {
      // Always refetch after error or success to make sure our local data is in sync with the server
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    },
  });

  // Create new conversation
  const createConversationMutation = useMutation<
    NewConversationResponse,
    Error,
    string
  >({
    mutationFn: async (modelName: string) => {
      if (!userId) throw new Error("User not authenticated");

      const response = await axios.post<NewConversationResponse>("/api/chat", {
        prompt: "Hello",
        userId,
        modelName,
      });

      return response.data;
    },
    onSuccess: (data) => {
      // Navigate to the new conversation
      router.push(`/chat/${data.conversationId}`);
    },
  });

  // NEW FUNCTION: Refresh messages (keeping only the first one)
  const refreshMessages = async () => {
    try {
      if (!conversationId) {
        console.error("No conversation ID available");
        return;
      }

      // Invalidate and refetch the conversation query to refresh messages
      await queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });

      // Optionally refetch immediately
      await queryClient.refetchQueries({
        queryKey: ["conversation", conversationId],
      });

      console.log("Messages refreshed successfully");
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  };

  // Get the messages from the conversation data
  const allMessages = conversationData?.conversation?.messages || [];

  // Skip the first message (base prompt) if there are messages
  const visibleMessages = allMessages.length > 0 ? allMessages.slice(1) : [];

  return {
    model: conversationData?.conversation?.model,
    history: visibleMessages,
    conversations: conversationsData?.conversations || [],
    sendMessage: (userMessage: string) =>
      sendMessageMutation.mutate(userMessage),
    createNewConversation: (modelName: string) =>
      createConversationMutation.mutate(modelName),
    isLoading: sendMessageMutation.isPending || isConversationLoading,
    isAiThinking,
    // Add the new refreshMessages function to the returned object
    refreshMessages,
  };
};
