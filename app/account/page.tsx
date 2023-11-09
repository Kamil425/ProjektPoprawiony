"use client"
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';
import Logo from 'public/Logo.webp';
import HandsLeft from '/public/HandsLeft.svg';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { get } from "http";
import { useSearchParams } from 'next/navigation';

type QuizHistory = {
  quizName: string;
  quizResult: number;
  quizDate: {
    $date: string;
  };
  // Dodaj pozostałe pola zgodnie z twoją strukturą danych
};


const Welcome = () => {
  const { data: session, status } = useSession(); // Add session status
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const router = useRouter();
 

  // Fetch quiz details function with userId as a parameter
  const getQuizDetails = async (userMail: string) => {
    try {
      const url = new URL("http://localhost:3000/api/account");
      const params = { email: userMail };
      const finalUrl = `${url}?${new URLSearchParams(params)}`;
      const res = await fetch(finalUrl, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });
      const quizData = await res.json();
      console.log(quizData);
      setUserQuizzes(quizData.data); // Update state with fetched data
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user) {
        const { email } = session.user; // Extract userId from the session user
        if (email) {
          getQuizDetails(email); // Fetch quiz details using the userEmail
        }
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);


  if (status === "loading") {
    // Wait for the session to be loaded
    return <div>Ładowanie...</div>;
  }

  if (session && session.user) {
    const { user } = session;
    return (
      <div className="h-full w-full flex justify-center flex-row p-5">
        <Navbar />
        <div className="h-full w-1/3 flex flex-col items-center justify-center">
          <div className="p-6 font-bold text-2xl">Witaj, {user.name}</div>
          <div className="h-full w-1/3 flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl">Historia Quizów</h1>
          <ul>
            {userQuizzes.map((quiz:any, index:any) => (
              <li key={index}>
                Quiz: {user.email}, Wynik: {quiz.quizResult}, Data: {new Date(quiz.quizDate.$date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
          
          <button className="p-3 border-three border-4" onClick={handleSignOut}>Wyloguj się</button>
        </div>
        <div className="h-full w-1/3 flex items-center justify-center">
          <p>Tutaj wyzwania</p>
        </div>
      </div>
    );
  }

  router.push("/login");

  return null;
};

  
export default Welcome;