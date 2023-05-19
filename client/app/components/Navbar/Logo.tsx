'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <Image
      onClick={() => router.push('/')}
      className="hidden md:block cursor-pointer" 
      src="/logo.png" 
      height="125" 
      width="125" 
      alt="Logo" 
    />
   );
}
 
export default Logo;
