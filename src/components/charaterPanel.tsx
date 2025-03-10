import Image from "next/image";

interface Props {
  name: string;
  img: string;
}

const ChraraterPanel = ({ name,img }: Props) => {
  return (
    <>
      <div className="h-36 w-80 bg-gray-100 flex items-center rounded-3xl mt-10">
        <div className="flex p-4">
          <div className="flex">
            <Image
              src={img}
              alt="error"
              width={114}
              height={200}
              className="object-cover h-28 w-24 flex rounded-3xl"
            />
            <div className="flex flex-col pl-4 text-gray-600 gap-2">
              <p className="text-black">{name}</p>
              <p>By: user</p>
              <p>description</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChraraterPanel;
