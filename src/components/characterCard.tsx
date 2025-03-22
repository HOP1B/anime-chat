import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { ModelType } from "@/lib/types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const CharacterCard = ({
  name,
  imageUrl,
  description,
  nameOfChar,
}: ModelType) => {
  const router = useRouter();
  const { session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const chatRouterHandler = async () => {
    try {
      setIsLoading(true);
      const userId = session?.user.id;

      if (!userId) {
        toast({
          title: "Authentication required",
          description: "Please sign in to start a chat",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(
        `/api/chat?userId=${userId}&modelName=${name}`
      );

      if (response.data?.conversationId) {
        router.push(`/chat/${response.data.conversationId}`);
      } else {
        throw new Error("Failed to create conversation");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const truncatedDescription =
    description.length > 70
      ? `${description.substring(0, 70)}...`
      : description;

  return (
    <Button
      onClick={chatRouterHandler}
      className="p-0 h-auto w-full max-w-l block bg-transparent hover:bg-transparent"
      disabled={isLoading}
    >
      <div className="h-auto w-full bg-white border border-gray-200 flex items-center rounded-xl transition-all hover:shadow-md hover:border-blue-200 cursor-pointer overflow-hidden">
        <div className="flex p-3 w-full">
          <div className="relative h-28 min-w-24 w-24 rounded-lg overflow-hidden bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${nameOfChar || name} character`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-xl font-bold">
                  {(nameOfChar || name)?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col pl-3 text-left w-full">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 line-clamp-1">
                {nameOfChar || name}
              </h3>

              {isLoading ? (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  Loading...
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  Ready
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1">By: user</p>

            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {truncatedDescription}
            </p>

            <div className="mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-blue-600 hover:text-blue-800">
                Start conversation →
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 border-2 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700">Connecting...</span>
          </div>
        </div>
      )}
    </Button>
  );
};

// Loading skeleton for the character card
export const CharacterCardSkeleton = () => {
  return (
    <div className="h-auto w-full max-w-xs bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex p-3 w-full">
        <Skeleton className="h-28 w-24 rounded-lg" />
        <div className="flex flex-col pl-3 w-full gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/2 mt-1" />
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
