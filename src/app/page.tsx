"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CharacterPanel from "@/components/characterPanel";
import { useSession } from "@clerk/nextjs";

const Home = () => {
  const { session } = useSession();

  return (
    <div className="h-screen mx-96 pt-10">
      <div className="flex text-gray-500 justify-between">
        <div>
          <p>Welcome back,</p>
          <p>{session?.user.username} </p>
        </div>
        <div className="relative inline-flex items-center">
          <Input
            className="w-80 h-12 py-4 pl-10 bg-slate-100 rounded-full"
            placeholder="Search for characters"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>
      <p className="mt-20">For you</p>
      <div className="flex gap-5 overflow-x-auto fixed">
        <CharacterPanel />
      </div>
    </div>
  );
};

export default Home;
