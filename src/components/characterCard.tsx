import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
import { ModelType } from "@/lib/types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CharacterCard = ({
  name,
  imageUrl,
  description,
  nameOfChar,
  isSelected,
}: ModelType & { isSelected?: boolean }) => {
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const truncatedDescription =
    description.length > 70
      ? `${description.substring(0, 70)}...`
      : description;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 2   }}
      animate={isSelected ? { scale: 1.1, y: -10 } : { scale: 1 }}
      className={`transform transition-all duration-300 h-full w-full ${
        isSelected 
          ? "z-20 shadow-xl" 
          : "hover:z-10"
      }`}
    >
      <Button
        onClick={chatRouterHandler}
        className={`p-0 h-full w-full block bg-transparent hover:bg-transparent ${
          isSelected 
            ? "border-2 border-blue-500" 
            : ""
        }`}
        disabled={isLoading}
      >
        <div className="h-full w-full bg-white border border-gray-200 flex flex-col rounded-xl transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer overflow-hidden">
          <div className="relative w-full h-screen bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${nameOfChar || name} character`}
                fill
                className="object-cover h-screen"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-4xl font-bold">
                  {(nameOfChar || name)?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            )}
            <div className="absolute top-2 right-2">
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
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-3 border-t-blue-600 border-white rounded-full animate-spin"></div>
              <span className="text-sm text-white font-bold">Loading...</span>
            </div>
          </div>
        )}
      </Button>
    </motion.div>
  );
};

export default CharacterCard;
