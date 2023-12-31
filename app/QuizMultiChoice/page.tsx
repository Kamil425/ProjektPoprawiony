
"use client"
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LINK from 'next/link';
import { getSession } from 'next-auth/react';

export default function Home() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');
  const [quiz, setQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<string[][]>([[]]);
  const [score, setScore] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

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

        const difficulty = data.data[0].Trudność;
        let time: any;

        const quizType = data.data[0].Typ;
        if (quizType === 'Quiz na czas') {
          if (difficulty === 'Łatwy') {
            time = 30 * data.data[0].Pytania.length;
          } else if (difficulty === 'Średni') {
            time = 15 * data.data[0].Pytania.length;
          } else if (difficulty === 'Trudny') {
            time = 10 * data.data[0].Pytania.length;
          }
        } else if (difficulty === 'Łatwy') {
          time = 120 * data.data[0].Pytania.length;
        } else if (difficulty === 'Średni') {
          time = 60 * data.data[0].Pytania.length;
        } else if (difficulty === 'Trudny') {
          time = 30 * data.data[0].Pytania.length;
        }

        setTimeLeft(time);
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quiz && quiz[0].Typ === 'Quiz bez limitu czasowego') {
      setTimeLeft(null);
      setShowTimer(false);
    } else if (timeLeft !== null && timeLeft > 0 && !quizFinished && quiz && quiz[0].Typ !== 'Quiz bez limitu czasowego') {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => (prevTime ? prevTime - 1 : prevTime));
      }, 1000);
    } else if (timeLeft === 0 && !quizFinished && quiz && quiz[0].Typ !== 'Quiz bez limitu czasowego') {
      compareAnswers();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, quizFinished, quiz]);

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

  const compareAnswers = async () => {
    let totalScore = 0;
    let timeFinish = timeString;
    let maxPoint = maxNumberOfPoints();
    const session = await getSession();
    const userId = session?.user?.email;
  
    quiz.forEach((singleQuiz: any, quizIndex: number) => {
      singleQuiz.Pytania.forEach((pytanie: any, questionIndex: number) => {
        pytanie.Odpowiedzi.forEach((odpowiedz: any, answerIndex: number) => {
          const userAnswer = userAnswers[quizIndex] && userAnswers[quizIndex][questionIndex];
          const isUserAnswerCorrect = userAnswer && Array.isArray(userAnswer) && userAnswer.includes(odpowiedz.Odpowiedz) && odpowiedz.Poprawna;
  
          if (isUserAnswerCorrect) {
            totalScore++;
          } else if (userAnswer && userAnswer.includes(odpowiedz.Odpowiedz) && !odpowiedz.Poprawna) {
            totalScore--; // Odejmujemy punkt za błędną odpowiedź
          }
        });
      });
    });
  
    if (totalScore < 0) {
      totalScore = 0; // Upewniamy się, że wynik nie spadnie poniżej zera
    }
  
    setScore(totalScore);
    setShowScoreboard(true);
    setQuizFinished(true);
    let maxTime;
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
            const typ = data.data[0].Typ;
            const difficulty = data.data[0].Trudność;
            if(typ === 'Quiz bez limitu czasowego'){
            maxTime = 0;
            } else
            if (difficulty === 'Łatwy') {
            maxTime = 120 * data.data[0].Pytania.length;
            } else if (difficulty === 'Średni') {
            maxTime = 60 * data.data[0].Pytania.length;
            } else if (difficulty === 'Trudny') {
            maxTime = 30 * data.data[0].Pytania.length;
            }
        } else {
        console.error('Error fetching quiz details');
        }
    } catch (error) {
        console.error('Network error:', error);
    }

    try {
        const res = await fetch('/api/QuizResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            quizId,
            userAnswers,
            scoreUser: totalScore,
            scoreMax: maxPoint,
            timeFinish: timeFinish,
            timeMax: maxTime,
          }),
        });
    
        if (res.ok) {
          // Handle successful response from the server
        } else {
          console.error('Error saving quiz results to the server');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };  

  

  const timeString = timeLeft
    ? `${Math.floor(timeLeft / 60)} min ${timeLeft % 60} sek`
    : '0 min 0 sek';

  if (loading) {
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        <p>Ładowanie...</p>
      </div>
    );
  } else if (!quiz) {
    return <p>Error: Couldn't fetch quiz data.</p>;
  } else if (showScoreboard === true) {
    return (
      <div className='h-full w-full flex flex-col'>
        <div className='h-1/6 w-full flex justify-center'>
          <Navbar />
        </div>
        <div className='h-4/6 w-full flex justify-center items-center '>
          <div className='h-4/6 w-1/3 flex justify-center flex-col items-center border-b-three bg-three rounded-full text-5xl text-white '>
            <p >Wynik quizu to</p>
            <p className='pt-10 text-8xl'>
              {score} / {maxNumberOfPoints()}
            </p>
          </div>
        </div>
        <div className='h-1/6 w-full flex flex-col justify-center items-center'>
          <LINK href="./SearchQuiz" className='h-1/2 w-1/6 bg-three flex flex-col justify-center items-center text-white rounded-md'>
            Complete
          </LINK>
        </div>
        <div className='h-2/6 w-full flex flex-col items-center'>
          {quiz.map((singleQuiz: any, quizIndex: number) => (
            <div key={singleQuiz._id} className='w-full p-4'>
              <h1 className='font-bold text-3xl'>{singleQuiz.Nazwa_Quizu}</h1>
              {singleQuiz.Pytania.map((pytanie: any, questionIndex: number) => (
                <div key={questionIndex} className='w-full p-4'>
                  <h1 className='text-2xl font-bold'>{pytanie.Pytanie}</h1>
                  <ul>
                    {pytanie.Odpowiedzi.map((odpowiedz: any, answerIndex: number) => (
                      <li
                        key={answerIndex}
                        className={`flex items-center ${
                          userAnswers[quizIndex] &&
                          userAnswers[quizIndex][questionIndex] &&
                          userAnswers[quizIndex][questionIndex].includes(odpowiedz.Odpowiedz)
                            ? odpowiedz.Poprawna
                              ? 'bg-green text-white border-b-three'
                              : 'bg-red text-white border-b-three'
                            : ''}`}
                        
                        
                      >
                        {odpowiedz.Odpowiedz}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className='h-full w-full flex flex-col'>
        <div className='h-1/6 w-full flex justify-center'><Navbar /></div>
        <div className='h-5/6 w-full flex flex-col items-center justify-center p-4'>
          {quiz.map((singleQuiz: any, quizIndex: number) => (
            <div key={singleQuiz._id} className='h-full w-full flex flex-col p-4'>
              <div className='h-1/6 w-full border-three border-4'>
                <h1 className='font-bold text-3xl flex justify-center'>{singleQuiz.Nazwa_Quizu}</h1>
                {showTimer && (
                  <p className='flex justify-end m-2'>Pozostało {timeString}</p>
                )}
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
                            type="checkbox"
                            name={`answer-${quizIndex}-${questionIndex}-${answerIndex}`}
                            value={odpowiedz.Odpowiedz}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const newAnswers:any[] = [...userAnswers];
                              if (!newAnswers[quizIndex]) newAnswers[quizIndex] = [];
                              if (!newAnswers[quizIndex][questionIndex]) newAnswers[quizIndex][questionIndex] = [''][0];
                              
                              if (isChecked) {
                                const currentAnswers = newAnswers[quizIndex][questionIndex];
                                if (Array.isArray(currentAnswers)) {
                                  newAnswers[quizIndex][questionIndex] = currentAnswers.concat(odpowiedz.Odpowiedz);
                                } else if (typeof currentAnswers === 'string') {
                                  newAnswers[quizIndex][questionIndex] = [currentAnswers, odpowiedz.Odpowiedz];
                                }
                              } else if (!isChecked) {
                                const currentAnswers = newAnswers[quizIndex][questionIndex];
                                if (Array.isArray(currentAnswers)) {
                                  newAnswers[quizIndex][questionIndex] = currentAnswers.filter((item: string) => item !== odpowiedz.Odpowiedz);
                                } else if (typeof currentAnswers === 'string') {
                                  newAnswers[quizIndex][questionIndex] = '';
                                }
                              }
                              
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
                  <span className='flex justify-center'>Zakończ Quiz</span>
                  
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
