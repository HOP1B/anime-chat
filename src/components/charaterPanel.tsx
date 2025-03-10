import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
  img: string;
  description: string;
  href: string; 
}

const CharacterPanel = ({ name, img, description , href }: Props) => {
  return (
    <Link href={href} className="block">
      <div className="h-36 w-80 bg-gray-100 flex items-center rounded-3xl mt-10 transition-all hover:shadow-md hover:bg-gray-200 cursor-pointer">
        <div className="flex p-4">
          <div className="flex">
            <Image
              src={img}
              alt={`${name} image`}
              width={114}
              height={200}
              className="object-cover h-28 w-24 flex rounded-xl"
            />
            <div className="flex flex-col pl-4 text-gray-600 gap-2">
              <p className="text-black">{name}</p>
              <p>By: user</p>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CharacterPanel;
