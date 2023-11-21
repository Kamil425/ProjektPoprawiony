"use client"
import { NextResponse } from 'next/server';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

const Welcome = () => {
  const { data: session, status } = useSession();
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const router = useRouter();
  const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);

  const getQuizDetails = async (userMail: string) => {
    try {
      const url = new URL('http://localhost:3000/api/account');
      const params = { email: userMail };
      const finalUrl = `${url}?${new URLSearchParams(params)}`;
      const res = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const quizData = await res.json();
      setUserQuizzes(quizData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user) {
        const { email } = session.user;
        if (email) {
          getQuizDetails(email);
        }
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const getPendingChallenges = async (userMail: string) => {
    try {
      const url = new URL('http://localhost:3000/api/pending-challenges');
      const params = { email: userMail };
      const finalUrl = `${url}?${new URLSearchParams(params)}`;
      const res = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const challengeData = await res.json();
      console.log(challengeData.data);
  
      setPendingChallenges(challengeData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      getQuizDetails(session.user.email);
      getPendingChallenges(session.user.email);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleStartQuiz = (quizId: any) => {
    router.push(`/Quiz?id=${quizId}`);
  };

  function formatTime(seconds: any) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  const isChallengeActive = (challenge: any) => {
    const initiatedAt = new Date(challenge.InitiatedAt);
    const currentTime = new Date();
    const timeDiff = Math.abs(currentTime.getTime() - initiatedAt.getTime());
    const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
    return challenge.Active && hoursDiff < 24;
  };

  if (status === 'loading') {
    return <div>Ładowanie...</div>;
  }
  const challengerName = pendingChallenges.map((challenge) => challenge.ChallengerEmail.split('@')[0]);
  const challengedName = pendingChallenges.map((challenge) => challenge.ChallengedEmail.split('@')[0]);
  console.log(challengerName, challengedName)
  if (session && session.user) {
    const { user } = session;
    return (
      <div className="h-full w-full flex justify-center flex-row p-5">
        <Navbar />
        <div className="h-full w-full flex flex-row items-center">
          <div className="h-2/3 w-2/3 flex flex-col items-center justify-center overflow-auto p-2">
            <span className="h-1/6 font-bold 2xl:text-2xl xl:text-xl l:text-lg md:text-lg sm:text-lg max-sm:text-xs">
            <h1>Twoja Historia</h1>
            </span>
            <ul className="h-2/3">
              {userQuizzes.length === 0 ? (
                <li>Brak rozwiązanych Quizów</li>
              ) : (
                
                userQuizzes.map((quiz, index) => (
                  <li key={index} className='border-2 border-solid border-secondary mb-2 rounded-xl bg-four p-2' >
                    <ul className='border-l-4 border-three rounded-xl p-2'>
                      <li>
                        <b className='text-secondary'>Quiz nr: </b>
                        {index+1}
                      </li>
                      <li>
                        <b className='text-secondary'>Nazwa:</b> {quiz.quizName}
                      </li>
                      <li>
                        <b className='text-secondary'>Poziom trudności: </b>
                        {quiz.quizDifficulty}
                      </li>
                      <li>
                        <b className='text-secondary'>Wynik: </b>
                        {quiz.quizResult} na {quiz.quizPoints} możliwych punktów
                      </li>
                      <li>
                        <b className='text-secondary'>Czas zakończenia testu: </b>
                        {quiz.quizTimeFinish} z {formatTime(quiz.quizTimeMax)} 
                      </li>
                      <li>
                        <b className='text-secondary' >Data: </b>
                        {new Date(quiz.quizDate).toLocaleString()}
                      </li>
                    </ul>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="h-2/3 w-1/4 flex flex-col items-center justify-center overflow-auto p-2 ">
          <span className="h-1/6 font-bold 2xl:text-2xl xl:text-xl l:text-lg md:text-lg sm:text-lg max-sm:text-xs">
            <h1>Lista Wyzwań:</h1>
          </span>
            <ul>
              {pendingChallenges.map((challenge, index) => (
                <li key={index} className='mb-2'>
                  
                    {!challenge.Active ? (
                      <>
                       <li key={index} className='border-2 border-solid border-secondary mb-2 rounded-xl bg-four p-2' >
                       <ul className='border-l-4 border-three rounded-xl p-2 '>
                        <li>
                          <b className='text-secondary'>Nazwa:</b> {challenge.QuizResult.quizName}
                        </li>
                        <li>
                          <b className='text-secondary' >Poziom trudności: </b>
                          {challenge.QuizResult.quizDifficulty}
                        </li>
                        <div className='flex mt-2'>
                        <div className='w-1/2 h-full mr-2'>
                          <h2 className='font-bold text-secondary'>Twój wynik:</h2>
                        <li>
                          <b className='text-secondary'>Punkty: </b>
                          {challenge.QuizResult.quizResult} na {challenge.QuizResult.quizPoints} możliwych punktów
                        </li>
                        <li>
                          <b className='text-secondary'>Czas zakończenia testu: </b>
                          {challenge.QuizResult.quizTimeFinish} z {formatTime(challenge.QuizResult.quizTimeMax)} min
                        </li>
                        <li>
                          <b className='text-secondary'>Data: </b>
                          {new Date(challenge.QuizResult.quizDate).toLocaleString()}
                        </li></div>
                        <div className='w-1/2 h-full ml-2'>
                        <h2 className='font-bold text-secondary'>{challenge.ChallengerEmail === session.user?.email
                              ? `Wynik ${challengedName[1]}`
                              : `Wynik ${challengerName[0]}`}</h2>
                        <li>
                          <b className='text-secondary'>Punkty: </b>
                          {challenge.OtherUserQuizResult
                            ? `${challenge.OtherUserQuizResult.quizResult} na ${challenge.OtherUserQuizResult.quizPoints} możliwych punktów`
                            : 'Brak'}
                        </li>
                        <li>
                          <b className='text-secondary'>Czas zakończenia testu: </b>
                          {challenge.OtherUserQuizResult
                            ? `${challenge.OtherUserQuizResult.quizTimeFinish} z ${formatTime(challenge.OtherUserQuizResult.quizTimeMax)}`
                            : 'Brak'}
                        </li>
                        <li>
                          <b className='text-secondary'>Data: </b>
                          {challenge.OtherUserQuizResult
                            ? `${new Date(challenge.OtherUserQuizResult.quizDate).toLocaleString()}`
                            : 'Brak'}
                        </li>
                        </div>
                        </div>
                        </ul>
                        </li>
                        
                      </>
                    ) : (
                      <>
                        <li>
                          <b className='text-secondary'>
                            {challenge.ChallengerEmail === session.user?.email
                              ? `Wysłałeś wyzwanie do: ${challenge.ChallengedEmail}`
                              : `Dostałeś wyzwanie od: ${challenge.ChallengerEmail}`}
                          </b>
                        </li>
                        <li>
                          <button
                            className={`text-three border-solid border-2 ${
                              isChallengeActive(challenge)
                                ? 'border-three'
                                : 'border-secondary pointer-events-none text-secondary'
                            }`}
                            onClick={() => handleStartQuiz(challenge.QuizId)}
                            disabled={!isChallengeActive(challenge)}
                          >
                            Rozpocznij Quiz
                          </button>
                        </li>
            </>
          )}
        
      </li>
    ))}
  </ul>
</div>
        </div>
      </div>
    );
  }

  router.push('/login');
  return null;
};

export default function AccountPage() {
  return (
    <SessionProvider>
      <Welcome />
    </SessionProvider>
  );
}
