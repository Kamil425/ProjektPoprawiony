"use client"
import Image from 'next/image'
import Logo from 'public/Logo.webp'
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { SessionProvider, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';


const Navbar = () => {
    const StartPage = ()=>{
        window.location.href = "/";
    }
    const { data: session } = useSession();
    const router = useRouter();


    const handleSignOut = async () => {
      await signOut();
      router.push("/login");
    };

    return (
        <div className="fixed flex justify-center h-1/6 w-5/6 bg-white">
          <div className="h-full w-full flex justify-center items-end flex-col">
            <div className="h-full w-full flex flex-row items-center">
              <div className="h-4/6 w-2/12">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="h-full w-full"
                  width={250}
                  height={150}
                  onClick={StartPage}
                />
              </div>
              <div className="w-5/12 h-full"></div>
              <div className="h-full w-6/12 justify-end flex flex-row items-center text-xl font-bold">
                <Link
                  href="/howwork"
                  className="w-2/4 mr-6 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-four hover:text-secondary transition-all duration-300"
                >
                  <p>Jak to działa?</p>
                </Link>
                <Link
                  href="/SearchQuiz"
                  className="w-2/4 mr-6 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-four hover:text-secondary transition-all duration-300"
                >
                  <p>Szukaj Quiz</p>
                </Link>
                <Link
                  href="/about"
                  className="w-2/4 mr-6 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-four hover:text-secondary transition-all duration-300"
                >
                  <p>O nas</p>
                </Link>
                {session ? (
                    <>
                    <Link
                      href="/account"
                      className="mr-6 h-1/2 w-2/4 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-three border-solid border-2 border-three relative flex items-center"
                    >
                      <button className="w-full h-full flex items-center justify-center hover:bg-three hover:text-secondary transition-all duration-500">
                        <span>Witaj {session?.user?.name}</span>
                      </button>
                    </Link>
                      <button className="h-1/2 w-1/4 2xl:text-l xl:text-l l:text-s md:text-s sm:text-xs max-sm:text-xs text-three border-solid border-2 border-three relative flex items-center justify-center hover:bg-three hover:text-secondary transition-all duration-500" onClick={handleSignOut}>
                        <span>Wyloguj</span>
                      </button>
                  </>
                  ) : (
                  <Link
                    href="/login"
                    className="mr-6 h-1/2 w-2/4 2xl:text-l xl:text-l l:text-s md:text-s sm:text-s max-sm:text-xs text-three border-solid border-2 border-three relative flex items-center"
                  >
                    <button className="w-full h-full flex items-center justify-center">
                      <span>Login</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
            <hr className="h-2 w-full bg-primary border-none"></hr>
          </div>
        </div>
      );
    };
    
   
    export default function NavbarPage() {
      return (
        <SessionProvider>
          <Navbar />
        </SessionProvider>
      );
    }