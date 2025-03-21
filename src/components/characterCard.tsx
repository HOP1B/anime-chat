import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ModelType } from "@/lib/types";
import { LoaderCircle } from "lucide-react";


const CharacterCard = ({
  name,
  imageUrl,
  description,
  nameOfChar,
}: ModelType) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const session = useSession();
  useEffect(() => {
    const fetchConversationId = async () => {
      try {
        const userId = session.session?.user.id;

        const response = await axios.get(
          `/api/chat?userId=${userId}&modelName=${name}`
        );
        if (response.data?.conversationId) {
          setConversationId(response.data.conversationId);
        }
      } catch (error) {
        console.error("Error fetching conversation ID:", error);
      }
    };

    fetchConversationId();
  }, [name, session]);

  const href = `/chat/${conversationId}`;
  if (conversationId === null) {
    return <LoaderCircle className="animate-spin mt-10 flex " size={50} />;
  }

  return (
    <Link href={href} className="block">
      <div className="h-36 w-80 bg-gray-100 flex items-center rounded-3xl mt-10 transition-all hover:shadow-md hover:bg-gray-200 cursor-pointer">
        <div className="flex p-4">
          <div className="flex">
            <Image
              src={imageUrl}
              alt={`${name} image`}
              width={114}
              height={200}
              className="object-cover h-28 w-24 flex rounded-xl"
            />
            <div className="flex flex-col pl-4 text-gray-600 gap-2">
              <p className="text-black">{nameOfChar}</p>
              <p>By: user</p>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard;
