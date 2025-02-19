"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Panel = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Card className="w-64 shadow-lg border-0 rounded-none flex flex-col">
          <CardHeader>
            <CardTitle>Anime-chat.Ai</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between flex-1">
            <div className="flex gap-2 flex-col">
              <Button className="w-[70px] rounded-3xl">Create</Button>
              <Button>Discover</Button>
              <Input></Input>
              <p className="text-gray-700">This week</p>
              <a href="">Gojo</a>
            </div>
            <Button className="">SignUp</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Panel;
