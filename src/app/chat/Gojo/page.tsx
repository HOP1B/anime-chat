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
              src="/gojo-pic2.jpeg"
              alt="gojo"
              width={80}
              height={10}
              className=" rounded-full mt-32"
            />
            <p>Satoru Gojo</p>
          </div>
          <div className="text-[#666666] flex flex-col items-center">
            <p>The strongest. Im the winner at everything.</p>
          </div>
          <ChatSideFooter name="Message Saturo Gojo..." />
        </div>
        <ChatSidebar
          name="Saturo Gojo"
          img="/gojo-pic2.jpeg"
          description="The strongest. Im the winner at everything."
        />
      </div>
    </>
  );
};

export default ChatSidePage;
