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
      className="p-0 h-full w-full rounded-xl overflow-hidden bg-transparent hover:bg-transparent relative group"
      disabled={isLoading}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${nameOfChar || name} character`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-2xl font-bold">
              {(nameOfChar || name)?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-xl mb-1">{nameOfChar || name}</h3>
          <p className="text-xs text-gray-300 mb-2">By: user</p>
          <p className="text-sm text-gray-200 mb-3">{truncatedDescription}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-blue-300 group-hover:text-blue-200">
              Start conversation →
            </span>
            {isLoading ? (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-900/50 text-blue-100 rounded">
                Loading...
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-green-900/50 text-green-100 rounded">
                Ready
              </span>
            )}
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 border-2 border-t-blue-400 border-white/30 rounded-full animate-spin"></div>
            <span className="text-sm text-blue-300">Connecting...</span>
          </div>
        </div>
      )}
    </Button>
  );
};

export const CharacterCardSkeleton = () => {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden bg-gray-800 relative">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <Skeleton className="h-6 w-3/4 bg-gray-700" />
        <Skeleton className="h-3 w-1/3 bg-gray-700 mt-2" />
        <Skeleton className="h-4 w-full bg-gray-700 mt-3" />
        <Skeleton className="h-4 w-full bg-gray-700 mt-1" />
        <div className="flex justify-between mt-3">
          <Skeleton className="h-3 w-1/3 bg-gray-700" />
          <Skeleton className="h-5 w-14 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
