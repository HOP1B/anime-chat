import Image from "next/image";
import ChatSideFooter from "../../../components/ChatFooter";
import ChatSidebar from "@/components/ChatSidebar";

const ChatSidePage = () => {
  return (
    <>
      <div className="h-screen w-full bg-[#fffff] flex items-center text-black gap-2 ">
        <div className="h-screen w-full flex flex-col items-center pl-24">
          <div>
            <Image
              src="/ZeroTwo.jpeg"
              alt="gojo"
              width={80}
              height={10}
              className=" rounded-full mt-32"
            />
            <p>Zero Two</p>
          </div>
          <div className="text-[#666666] flex flex-col items-center">
            <p>I`m Zero Two from Darling In The Franxx</p>
          </div>
          <ChatSideFooter name="Message Zero Two..." />
        </div>
        <ChatSidebar
          name="Zero Two"
          img="/ZeroTwo.jpeg"
          description="I'm Zero Two from Darling In The Franxx"
        />
      </div>
    </>
  );
};

export default ChatSidePage;
