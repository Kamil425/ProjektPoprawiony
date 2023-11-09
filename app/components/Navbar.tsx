"use client"
import Image from 'next/image'
import Logo from 'public/Logo.webp'
import Link from 'next/link';
<<<<<<< Updated upstream
=======
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
>>>>>>> Stashed changes

const Navbar = () => {
    const StartPage = ()=>{
        window.location.href = "/";
    }
    return ( 
        <div className=" fixed flex justify-center h-1/6 w-5/6 bg-white">
            <div className="h-full w-full flex justify-center items-end flex-col">
                <div className = "h-full w-full flex flex-row items-center">
                    <div className = "h-4/6 w-2/12"><Image src={Logo} alt="Logo" className='h-full w-full' width="250" height="150" onClick={StartPage}/></div>
                    <div className='w-5/12 h-full'></div>
                    <div className='h-full w-6/12 justify-end flex flex-row items-center text-xl font-bold'>
                        <Link href="/howwork" className='w-2/4 mr-6 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-four hover:text-secondary transition-all duration-300'><p>Jak to działa?</p></Link>
                        <p className='w-2/4 mr-6 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-four hover:text-secondary transition-all duration-300'>Features</p>
                        <Link href="/about" className='w-2/4 mr-6 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-four hover:text-secondary transition-all duration-300'><p >O nas</p></Link>
                        <Link href="/login" className="mr-6 h-1/2 w-2/4 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-three border-solid border-2 border-three relative flex items-center"><button className="w-full h-full flex items-center justify-center"><span>Login</span></button></Link>
                    </div>
                    </div>
                <hr className="h-2 w-full bg-primary border-none"></hr>
            </div>
        </div>
<<<<<<< Updated upstream
     );
}
 
export default Navbar;
=======
      );
    };
    
    export default function NavbarPage() {
      return (
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );
    }
>>>>>>> Stashed changes
