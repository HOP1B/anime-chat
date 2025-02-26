import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Home = () => {
  return (
    <>
      <div className="h-screen mx-96 pt-10">
        <div className="flex text-gray-500 justify-between">
          <div>
            <p>Welcome back,</p>
            <p>user</p>
          </div>
          <div className="relative">
            <Input
              className="w-80 h-12 py-4 pl-10  bg-slate-100 rounded-full"
              placeholder="Search for characters"
            />
            <Search className="absolute bottom-3 left-3 w-5" />
          </div>
        </div>
        <div className="mt-20">
          <p>For you</p>
        </div>
      </div>
    </>
  );
};

export default Home;
