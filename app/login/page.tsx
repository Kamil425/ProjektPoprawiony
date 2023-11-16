"use client";
import Image from 'next/image';
import HandsLeft from '/public/HandsLeft.svg';
import Logo from 'public/Logo.webp';
import { signIn } from "next-auth/react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useSpring, animated } from '@react-spring/web';

const StartPage = ()=>{
  window.location.href = "/";
}
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Nowa zmienna stanu

  const router = useRouter();

  // Ustawienie animacji
  const fadeIn = useSpring({
    opacity: loginSuccess ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleSignupClick = () => {
    router.push('/rejestracja');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res: any = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        alert('Invalid Credentials');
        return;
      } else {
        const form = e.target;
        form.reset();
        setLoginSuccess(true);
        setIsAuthenticated(true); // Ustawienie, że użytkownik jest zalogowany

        // Po udanym zalogowaniu przekieruj użytkownika
        setTimeout(() => {
          router.push('/');
        }, 2000); // Przekieruj po 2 sekundach
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
<div className="h-full w-full flex flex-row p-5">
      <div className="h-full w-1/2 flex flex-col items-center justify-center">
        <animated.div style={fadeIn}>
          {isAuthenticated ? (
            <div className="p-6">Witamy na serwisie!</div>
          ) : (
            <div className="p-6">Zaloguj się</div>
          )}
        </animated.div>
        <form className="w-1/2 p-5" onSubmit={handleSubmit}>
          <div className="p-5 mb-2 border-2">
            <div className="border-l-three border-l-4 pl-2">
              <label>Email:</label>
              <br />
              <input
                type="text"
                className="h-1/4 w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
            </div>
          </div>
          <div className="p-5 mb-2 border-2">
            <div className="border-l-three border-l-4 pl-2">
              <label>Hasło:</label>
              <br />
              <input
                type="password"
                className="h-1/4 w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
            </div>
          </div>
          <div className="h-full w-full flex flex-row">
            <button className="h-1/3 w-1/2 bg-three mr-4">Zaloguj się</button>
            <Link href="/rejestracja" className='h-1/3 w-1/2'><button className="h-full w-full border-three border-solid border-2 flex items-center justify-center">Zarejestruj się</button></Link>
          </div>
        </form>
      </div>
      <div className="h-full w-1/2 flex border justify-center">
        <Image src={HandsLeft} alt="Zdjęcie" />
      </div>
      <div className="h-full w-1/2 flex"></div>
    </div>
  );
};

export default Login;