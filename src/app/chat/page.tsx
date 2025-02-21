import Image from "next/image";
import ChatSideFooter from "../../components/ChatFooter";
import ChatSidebar from "@/components/ChatSidebar";


const ChatSidePage = () => {
  return (
    <>
      <div className=" h-screen w-full bg-[#fffff] flex items-center text-black  gap-2 ">
        <div className=" h-screen w-full flex flex-col items-center">
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
        </div>
        <ChatSideFooter />
        <ChatSidebar />
      </div>
    </>
  );
};

export default ChatSidePage;
