"use client"
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LINK from 'next/link';

export default function Home() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');
  const [quiz, setQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<string[][]>([[]]);
  const [score, setScore] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [loading, setLoading] = useState(true);

  const getQuizDetails = async () => {
    try {
      const res = await fetch('/api/Quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizId }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuiz(data.data);
        setLoading(false);
      } else {
        console.error('Error fetching quiz details');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    if (quizId) {
      getQuizDetails();
    }
  }, [quizId]);

  const maxNumberOfPoints = () => {
    let max = 0;
    quiz.forEach((singleQuiz: any, quizIndex: number) => {
      singleQuiz.Pytania.forEach((pytanie: any, questionIndex: number) => {
        pytanie.Odpowiedzi.forEach((odpowiedz: any, answerIndex: number) => {
          if (odpowiedz.Poprawna) {
            max++;
          }
        });
      });
    });

    return max;
  };

  const compareAnswers = () => {
    let totalScore = 0;
    quiz.forEach((singleQuiz: any, quizIndex: number) => {
      singleQuiz.Pytania.forEach((pytanie: any, questionIndex: number) => {
        pytanie.Odpowiedzi.forEach((odpowiedz: any, answerIndex: number) => {
          if (
            userAnswers[quizIndex] &&
            userAnswers[quizIndex][questionIndex] &&
            userAnswers[quizIndex][questionIndex] === odpowiedz.Odpowiedz &&
            odpowiedz.Poprawna
          ) {
            totalScore++;
          }
        });
      });
    });

    setScore(totalScore);
    setShowScoreboard(true);
  };

  if (loading) {
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        <p>Ładowanie...</p>
      </div>
    );
  } else if (!quiz) {
    return <p>Error: Couldn't fetch quiz data.</p>;
  } 
  else if(showScoreboard===true){
    return(
  <div className='h-full w-full flex flex-col'>
    <div className='h-1/6 w-full flex justify-center'>
      <Navbar />
    </div>
    <div className='h-4/6 w-full flex justify-center items-center '>
      <div className='h-5/6 w-1/3 flex justify-center flex-col items-center border-b-three bg-three rounded-full text-5xl text-white '>
      
      <p className=''>Wynik quizu to</p>
      <p className='pt-10 text-8xl'> {score} / {maxNumberOfPoints()}</p>
      </div>
    </div>
    <div className='h-1/6 w-full flex flex-col justify-center items-center'>
      <LINK href="./SearchQuiz" className='h-1/2 w-1/6 bg-three flex flex-col justify-center items-center text-white rounded-md'>Complete</LINK>
    </div>
  </div>
    
    
    );
    }
  else {
    return (
      <div className='h-full w-full flex flex-col'>
        <div className='h-1/6 w-full flex justify-center'><Navbar /></div>
        <div className='h-5/6 w-full flex flex-col items-center justify-center p-4'>
          {quiz.map((singleQuiz: any, quizIndex: number) => (
            <div key={singleQuiz._id} className='h-full w-full flex flex-col p-4'>
              <div className='h-1/6 w-full border-three border-4 flex justify-center items-center'>
              <h1 className='font-bold text-3xl'>{singleQuiz.Nazwa_Quizu}</h1>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); compareAnswers(); }}>
                {singleQuiz.Pytania.map((pytanie: any, questionIndex: number) => (
                  <div key={questionIndex} className='h-5/6 w-full border-l-4 border-l-three border-r-4 border-r-three border-b-4 border-b-three flex flex-col items-center'>
                    <h1 className='text-2xl font-bold'>{pytanie.Pytanie}</h1>
                    {pytanie.Odpowiedzi.map((odpowiedz: any, answerIndex: number) => (
                      <div key={answerIndex} className='h-1/6 w-full flex p-4 rounded-xl hover:bg-three transition-all duration-500'>
                        <div className='h-full w-5/6'>
                          <h1 className='text-1xl font-bold'>{odpowiedz.Odpowiedz}</h1>
                        </div>
                        <div className='h-full w-1/6 flex justify-end'>
                          <input
                            type="radio"
                            name={`answer-${quizIndex}-${questionIndex}`}
                            value={odpowiedz.Odpowiedz}
                            onChange={() => {
                              const newAnswers = [...userAnswers];
                              if (!newAnswers[quizIndex]) newAnswers[quizIndex] = [];
                              if (!newAnswers[quizIndex][questionIndex]) newAnswers[quizIndex][questionIndex] = '';
                              newAnswers[quizIndex][questionIndex] = odpowiedz.Odpowiedz;
                              setUserAnswers(newAnswers);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <button
                  type="submit"
                  className='h-1/6 w-full font-bold text-2xl border-l-4 border-l-three border-r-4 border-r-three border-b-4 border-b-three'
                >
                  Zakończ Quiz
                </button>
              </form>
            </div>
          ))}
        </div>
        
      </div>
    );
  }
}
