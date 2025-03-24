"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CharacterPanel from "@/components/characterPanel";
import { useSession } from "@clerk/nextjs";

const Home = () => {
  const { session } = useSession();

  return (
    <div className="h-screen flex flex-col px-6 pt-10 pb-4 w-full ">
      <div className="flex justify-between items-center">
        <div className="text-gray-700">
          <p className="text-gray-500">Welcome back,</p>
          <p className="font-black text-3xl">
            {session?.user.username || "User"}
          </p>
        </div>
        <div className="relative inline-flex items-center">
          <Input
            className="w-80 h-12 py-4 pl-10 bg-slate-100 rounded-full"
            placeholder="Search for characters"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <CharacterPanel />
      </div>
    </div>
  );
};

export default Home;
