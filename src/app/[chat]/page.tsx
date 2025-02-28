"use client";
import Image from "next/image";
import ChatSideFooter from "../../components/ChatFooter";
import ChatSidebar from "@/components/ChatSidebar";
// import { useSession } from "@clerk/nextjs";
// import { useParams } from "next/navigation";

const ChatSidePage = () => {
  // const { session } = useSession();
  // const { modelName } = useParams();
  // const chatHistory = await fetch(
  //   `/api/history?userId=${session?.user.id}&model=${modelName}`,
  //   {}
  // );

  return (
    <>
      <div className="h-screen w-full bg-[#fffff] flex items-center text-black gap-2 ">
        <div className="h-screen w-full flex flex-col items-center pl-24">
          <div>
            <Image
              src="/download.jpeg"
              alt="gojo"
              width={80}
              height={10}
              className=" rounded-full mt-32"
            />
            <p>Satoru Gojo</p>
          </div>
          <div className="text-[#666666] flex flex-col items-center">
            <p>The strongest. Im the winner at everything.</p>
            <p>By name</p>
          </div>
          <ChatSideFooter />
        </div>
        <ChatSidebar />
      </div>
    </>
  );
};

export default ChatSidePage;
