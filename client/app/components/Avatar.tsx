"use client";

import { User } from "@prisma/client";

// import useActiveList from "../hooks/useActiveList";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User;
  h?: number;
  w?: number;
  src?: string | null | undefined;
}
const Avatar: React.FC<AvatarProps> = ({ user, h, w, src }) => {
  //   const {members} = useActiveList();

  //   const isActive = members.indexOf(user?.email!) !== -1;

  const isActive = false;

  return (
    <div className="relative">
      <div
        className={` relative 
          inline-block 
          rounded-full 
          overflow-hidden
          mt-2
          m-auto
          ${h ? "h-6" : "h-9"}
          ${w ? "w-6" : "w-9"}

          ${h ? "md:h-8" : "md:h-11"}
          ${w ? "md:w-8" : "md:w-11"}
          `}
      >
        <Image
          fill
          src={src || "/images/placeholder.jpg"}
          alt="Avatar"
          className=""
        />
      </div>
      {isActive ? (
        <span
          className={` absolute 
          block 
          rounded-full 
          bg-green-500 
          ring-2 
          ring-white 
          top-0 
          right-0
          h-2 
          w-2 
          ${h && "md:h-2"}
          ${w && "md:w-2"}
          md:h-3 
          md:w-3`}
        />
      ) : null}
    </div>
  );
};

export default Avatar;
