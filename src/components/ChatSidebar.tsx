import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const ChatSidebar = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100 ">
        <Card className="w-64 shadow-lg border-0 rounded-none flex flex-col">
          <CardHeader>
            <div className="flex gap-2 items-center">
              <Image
                src="/download.jpeg"
                alt="gojo"
                width={80}
                height={10}
                className=" rounded-full"
              />
              <div className="flex flex-col">
                <p>Gojo Saturo</p>
                <p className="text-[#666666]">by User name</p>
              </div>
              <div></div>
            </div>
            <CardTitle></CardTitle>
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

export default ChatSidebar;
