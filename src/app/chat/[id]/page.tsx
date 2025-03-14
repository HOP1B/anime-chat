import Image from "next/image";
import ChatSideFooter from "@/components/ChatFooter";
import ChatSidebar from "@/components/ChatSidebar";

const ChatSidePage = () => {
  return (
    <>
      <div className="h-screen w-full bg-[#fffff] flex items-center text-black gap-2 ">
        <div className="h-screen w-full flex flex-col items-center pl-24">
          <div>
            <Image
              src="/akeno.jpeg"
              alt="gojo"
              width={80}
              height={10}
              className="rounded-full mt-32"
            />
            <p>Akeno Himejima</p>
          </div>
          <div className="text-[#666666] flex flex-col items-center">
            <p>Priestess of Thunder and Lightning</p>
          </div>
          <ChatSideFooter name="Message Akeno Himejima..." />
        </div>
        <ChatSidebar
          name="Akeno Himejima"
          img="/akeno.jpeg"
          description="Priestess of Thunder and Lightning"
        />
      </div>
    </>
  );
};

export default ChatSidePage;
