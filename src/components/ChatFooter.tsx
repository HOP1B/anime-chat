import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatSideFooter = () => {
  return (
    <>
      <div className="flex justify-center">
        <div className=" fixed bottom-4 p-2">
          <Input
            className="rounded-full bg-gray-100 w-[600px] h-11 relative focus:outline-none "
            placeholder="Message Gojo Saturo..."
          />
          <Button className=" rounded-full absolute bottom-3 right-3">
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatSideFooter;
