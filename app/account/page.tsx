"use client"
import { useSession, signOut } from "next-auth/react";
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { get } from "http";
import { useSearchParams } from 'next/navigation';

const Welcome = () => {
  const { data: session, status } = useSession(); // Add session status
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const router = useRouter();
  const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);

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


  const getPendingChallenges = async (userMail: string) => {
    try {
      const url = new URL("http://localhost:3000/api/pending-challenges"); // Modify the API route accordingly
      const params = { email: userMail };
      const finalUrl = `${url}?${new URLSearchParams(params)}`;
      const res = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const challengeData = await res.json();
      console.log(challengeData);
      setPendingChallenges(challengeData.data); // Update state with fetched data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      getQuizDetails(session.user.email);
      getPendingChallenges(session.user.email);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  const handleStartQuiz = (quizId:any) => {
    // Perform actions when starting the quiz, e.g., redirect to the quiz page
    router.push(`/Quiz?id=${quizId}`);
  };

  function formatTime(seconds:any) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  if (status === "loading") {
    // Wait for the session to be loaded
    return <div>Ładowanie...</div>;
  }

  if (session && session.user) {
    const { user } = session;
    return (
      <div className="h-full w-full flex justify-center flex-row p-5">
        <Navbar />
        <div className="h-full w-2/3 flex flex-row items-center">
          <div className="h-2/3 w-full flex flex-col items-center justify-center overflow-auto p-2">
            <p className="h-1/6 font-bold 2xl:text-3xl xl:text-2xl l:text-xl md:text-xl sm:text-xl max-sm:text-xs">Ostatnio wykonane Quizy:</p>
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
                    <li><b>Wynik: </b>{quiz.quizResult} na {quiz.quizPoints} możliwych punktów</li>
                    <li><b>Czas zakończenia testu: </b>{quiz.quizTimeFinish} z {formatTime(quiz.quizTimeMax)} min</li>
                    <li><b>Data: </b>{new Date(quiz.quizDate).toLocaleString()}</li>
                  </ul>
                </li>
              ))
            )}
          </ul>
          </div>
          <div className="h-2/3 w-2/3 flex flex-col items-center justify-center overflow-auto p-2">
          <p>Lista wyzwań:</p>
          <ul>
          {pendingChallenges.map((challenge, index) => (
              <li key={index}>
                <ul>
                  <li>
                    <b>
                      {challenge.challengerEmail === session.user?.email
                        ? `Wysłałeś wyzwanie do: ${challenge.challengedUserEmail}`
                        : `Dostałeś wyzwanie od: ${challenge.challengerEmail}`}
                    </b>
                  </li>
                  <li>
                    <button
                      className="text-three border-solid border-2 border-three"
                      onClick={() => handleStartQuiz(challenge.quizId)}
                    >
                      Rozpocznij Quiz
                    </button>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    );
  }

  router.push("/login");

  return null;
};

export default function AccountPage() {
  return (
    <SessionProvider>
      <Welcome />
    </SessionProvider>
  );
}