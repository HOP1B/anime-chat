"use client";
import { useSession } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";

const Panel = () => {
  console.log(useSession());
  return (
    <div className="flex h-screen w-64 bg-gray-100 overflow-hidden">
      <Card className="w-full shadow-lg border-0 border-r-[1px] border-black rounded-none flex flex-col">
        <CardHeader>
          <CardTitle>Anime-chat.Ai</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1 overflow-hidden">
          <div className="flex gap-2 flex-col">
            <Button className="w-[70px] rounded-3xl">Create</Button>
            <Button>Discover</Button>
            <Input></Input>
            <p className="text-gray-700">This week</p>
            <a href="">Gojo</a>
          </div>{" "}
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
