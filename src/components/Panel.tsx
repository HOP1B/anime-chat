"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";

// Define user type
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
          <CardTitle>Anime-chat.Ai</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1 overflow-hidden">
          <div className="flex gap-2 flex-col">
            <Button className="w-[70px] rounded-3xl">Create</Button>
            <Button>Discover</Button>
            <Input placeholder="Search..." />
            <p className="text-gray-700">This week</p>
            <a href="">Gojo</a>
          </div>
          <SignedOut>
            <SignUpButton />
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
