import { Trash2 } from "lucide-react";

const ChatHistory = () => {
  return (
    <>
      <div>
        <div>
          <div className="flex justify-between">
            <p className=" text-black">Title</p>
            <Trash2 className=" hover:cur" />
          </div>
          <p className="border-b pb-2">chat History</p>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
