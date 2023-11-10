"use client"
import { useSession, signOut } from "next-auth/react";
<<<<<<< Updated upstream
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

=======
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
>>>>>>> Stashed changes

const Welcome = () => {
  const { data: session, status } = useSession(); // Add session status
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const router = useRouter();
<<<<<<< Updated upstream
 

=======
  
>>>>>>> Stashed changes
  // Fetch quiz details function with userId as a parameter
  const getQuizDetails = async (userMail: string) => {
    try {
      const url = new URL("http://localhost:3000/api/account");
      const params = { email: userMail };
      const finalUrl = `${url}?${new URLSearchParams(params)}`;
<<<<<<< Updated upstream
      const res = await fetch(finalUrl, { 
=======
      const res = await fetch(finalUrl, {
>>>>>>> Stashed changes
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
      });
      const quizData = await res.json();
      console.log(quizData);
      setUserQuizzes(quizData.data); // Update state with fetched data
    } catch (error) {
      console.log(error);
    }
  };

<<<<<<< Updated upstream
  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  function formatTime(seconds:any) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
>>>>>>> Stashed changes

  if (status === "loading") {
    // Wait for the session to be loaded
    return <div>Ładowanie...</div>;
  }

  if (session && session.user) {
    const { user } = session;
    return (
      <div className="h-full w-full flex justify-center flex-row p-5">
        <Navbar />
<<<<<<< Updated upstream
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
=======
        <div className="h-full w-full flex flex-row items-center">
          <div className="h-2/3 w-2/3 flex flex-col items-center justify-center overflow-auto p-2">
            <h1 className="h-1/6 font-bold text-2xl">Ostatnio wykonane Quizy:</h1>
           <ul className="h-2/3">
            {userQuizzes.length === 0 ? (
              <li>Brak rozwiązanych Quizów</li>
            ) : (
              userQuizzes.map((quiz, index) => (
                <li key={index}>
                  <ul>
                    <li><b>Quiz nr: </b>{index}</li>
                    <li><b>Nazwa:</b> {quiz.quizName}</li>
                    <li><b>Poziom trudności: </b>{quiz.quizDifficulty}</li>
                    <li><b>Wynik: </b>{quiz.quizResult} na {quiz.quizPoints} możliwe punkty</li>
                    <li><b>Czas zakończenia testu: </b>{quiz.quizTimeFinish} z {formatTime(quiz.quizTimeMax)} min</li>
                    <li><b>Quiz zrobiony: </b>{new Date(quiz.quizDate).toLocaleString()}</li>
                  </ul>
                </li>
              ))
            )}
          </ul>
          </div>
          <div className="h-full w-1/3 flex items-center justify-center">
            <p>Tutaj wyzwania</p>
          </div>
>>>>>>> Stashed changes
        </div>
      </div>
    );
  }

  router.push("/login");

  return null;
};

<<<<<<< Updated upstream
  
export default Welcome;
=======
export default function AccountPage() {
  return (
    <SessionProvider>
      <Welcome />
    </SessionProvider>
  );
}
>>>>>>> Stashed changes
