import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";
import { ImageDown } from "lucide-react";
import { SquarePen } from "lucide-react";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { CharacterPanelProps } from "@/lib/types";

const ChatSidebar = ({ name, img, description }: CharacterPanelProps) => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100 ">
        <Card className="w-64 shadow-lg border-0 rounded-none flex flex-col">
          <CardHeader>
            <div className="flex gap-3 items-center">
              <Image
                src={img}
                alt="gojo"
                width={80}
                height={10}
                className=" rounded-full"
              />
              <div>
                <div className="flex flex-col">
                  <p>{name}</p>
                  <p className="text-[#666666]">by User name</p>
                </div>
              </div>
            </div>
            <CardTitle className="flex flex-col border-b">
              <div className="flex m-2 justify-between ">
                <div className="border p-2 rounded-full w-10 h-10 flex items-center justify-center hover:cursor-pointer">
                  <ImageDown />
                </div>
                <div className="border p-2 rounded-full w-10 h-10  flex items-center justify-center hover:cursor-pointer">
                  <Flag />
                </div>
              </div>
              <p className="font-extralight text-xs text-gray-700 mb-2">
                {description}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between flex-1">
            <div className="flex gap-2 flex-col">
              <Button className="w-32 rounded-3xl h-10" variant="secondary">
                <SquarePen />
                New Chat
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="w-52 flex justify-between">
                    History <ChevronRight />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>History</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ChatSidebar;
