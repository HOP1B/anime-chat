"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import axios from "axios";

// Define your types
type UserData = {
  name: string | null;
  email: string | null;
  image: string | null;
};

type ModelType = {
  id: string;
  name: string;
  nameOfChar: string;
  imageUrl: string;
  createdAt: string;
};

type ConversationType = {
  id: string;
  userId: string;
  modelId: string;
  createdAt: string;
  model: ModelType;
};

const saveUserToDB = async (user: UserData & { id: string }) => {
  try {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      console.error("Failed to save user:", await res.json());
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

const Panel = () => {
  const { user, isSignedIn } = useUser();
  const { session } = useSession();
  const userId = session?.user.id;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save user to DB when signed in
  useEffect(() => {
    if (user && isSignedIn) {
      const userObj: UserData & { id: string } = {
        id: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress || null,
        image: user.imageUrl || null,
      };

      saveUserToDB(userObj);
      setUserData(userObj);
    }
  }, [user, isSignedIn]);

  // Fetch user's chat interactions
  useEffect(() => {
    const fetchInteractedModels = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/user/chatInteractions?userId=${userId}`
        );
        if (response.data) {
          setConversations(response.data);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInteractedModels();
  }, [userId]);

  return (
    <div className="flex h-screen w-64 bg-gray-100">
      <Card className="w-full shadow-lg border-0 border-r-[1px] border-black rounded-none flex flex-col">
        <CardHeader>
          <CardTitle>
            <Link href="/">Anime-chat.Ai</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1 overflow-hidden">
          <div className="flex gap-2 flex-col">
            {isLoading ? (
              <div></div>
            ) : (
              <>
                {conversations.length > 0 && (
                  <p className="text-gray-700 my-4">Recent Chats</p>
                )}
                {conversations.map((convo) => (
                  <Link
                    key={convo.id}
                    href={`/chat/${convo.id}`}
                    className="py-1 px-2 rounded-2xl flex items-center gap-3 w-full h-14 hover:bg-gray-200"
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={convo.model.imageUrl || "/default-avatar.png"}
                        alt={convo.model.nameOfChar}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate">{convo.model.nameOfChar}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="mt-auto pt-4">
            <SignedOut>
              <div className="flex justify-center border bg-gray-100 rounded-full p-2">
                <SignUpButton />
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 truncate">
                  {userData?.name || ""}
                </span>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Panel;
