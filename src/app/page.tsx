"use client";
import CharacterPanel from "@/components/characterPanel";

const Home = () => {
  return (
    <div className="h-screen flex flex-col px-4 pt-2 pb-2 w-full ">
      <div className="flex-grow overflow-hidden">
        <CharacterPanel />
      </div>
    </div>
  );
};

export default Home;
