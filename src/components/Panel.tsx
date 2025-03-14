"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Compass } from "lucide-react";
import { Search } from "lucide-react";

type UserData = {
  name: string | null;
  email: string | null;
  image: string | null;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userData, setUserData] = useState<UserData | null>(null);

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

  return (
    <div className="flex h-screen w-64 bg-gray-100 overflow-hidden z-50 fixed">
      <Card className="w-full shadow-lg border-0 border-r-[1px] border-black rounded-none flex flex-col">
        <CardHeader>
          <CardTitle>
            <a href="http://localhost:3000">Anime-chat.Ai</a>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1 overflow-hidden">
          <div className="flex gap-2 flex-col">
            <Button className="w-[90px] rounded-3xl bg-gray-100 text-black pl-10">
              Create
              <Plus className="absolute left-9" />
            </Button>
            <Button className="bg-gray-100 text-black ">
              <Compass className="absolute left-9" />
              Discover
            </Button>
            <div className="relative">
              <Input placeholder="Search..." className="pl-10 bg-gray-100" />
              <Search className="w-4 absolute top-[6px] left-2" />
            </div>
            <p className="text-gray-700 my-4">This week</p>
            <a
              href="http://localhost:3000/chat/Gojo"
              className="border py-1 px-2 rounded"
            >
              Gojo Saturo
            </a>
            <a
              href="http://localhost:3000/chat/ZeroTwo"
              className="border py-1 px-2 rounded"
            >
              Zero Two
            </a>
            <a
              href="http://localhost:3000/chat/akenoo"
              className="border py-1 px-2 rounded"
            >
              Akeno Himejima
            </a>
          </div>
          <SignedOut>
            <div className="flex justify-center border bg-gray-100 rounded-full p-2">
              <SignUpButton />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  );
};

export default Panel;
