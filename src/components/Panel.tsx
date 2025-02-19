"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Panel = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100 ">
        <Card className="w-64 shadow-lg">
          <CardHeader>
            <CardTitle>Anime-chat.Ai</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-col">
            <Button className="w-[70px] rounded-3xl">Create</Button>
            <Button>Discover</Button>
            <p className="text-gray-700">
              This is a simple Next.js 15.1 component using Tailwind CSS and
              ShadCN UI.
            </p>
            <Button className="mt-4 w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Panel;
