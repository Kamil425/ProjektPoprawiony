"use client"
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
  const [formValues, setFormValues] = useState({
    NazwaQuiz: '',
    KategoriaQuiz: '',
    TypQuiz: 'Flashcard',
    TrudnoscQuiz: 'Łatwy',
    Questions: [] as {
      question: string;
      answers: { answer: string; isCorrect: boolean }[];
    }[],
    newQuestion: '',
    newAnswers: [{ answer: '', isCorrect: false }, { answer: '', isCorrect: false }, { answer: '', isCorrect: false }],
  });
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (event:any) => {
    setFormValues({ ...formValues, newQuestion: event.target.value });
  };

  const addQuestion = () => {
    if (formValues.newQuestion) {
      const newQuestion = {
        question: formValues.newQuestion,
        answers: formValues.newAnswers.map((answer, index) => ({
          answer: answer.answer,
          isCorrect: answer.isCorrect,
        })),
      };
      setFormValues({
        ...formValues,
        Questions: [...formValues.Questions, newQuestion],
        newQuestion: '',
        newAnswers: formValues.TypQuiz === 'Quiz prawda fałsz' ? [{ answer: 'True', isCorrect: true }, { answer: 'False', isCorrect: false }] : [{ answer: '', isCorrect: false }, { answer: '', isCorrect: false }, { answer: '', isCorrect: false }, { answer: '', isCorrect: false }],
      });
    }
  };

  const handleTypQuizChange = (event:any) => {
    const selectedTypQuiz = event.target.value;
    const defaultAnswers =
      selectedTypQuiz === 'Quiz prawda fałsz' ? [{ answer: 'True', isCorrect: true }, { answer: 'False', isCorrect: false }] : [{ answer: '', isCorrect: false }, { answer: '', isCorrect: false }, { answer: '', isCorrect: false }, { answer: '', isCorrect: false }];

    setFormValues({
      ...formValues,
      TypQuiz: selectedTypQuiz,
      newAnswers: defaultAnswers,
    });
  };

  const handleAnswerChange = (event:any, index:any) => {
    const newAnswers = [...formValues.newAnswers];
    newAnswers[index].answer = event.target.value;
    setFormValues({ ...formValues, newAnswers });
  };

  const handleCorrectAnswerChange = (index:any) => {
    if (formValues.TypQuiz === 'Quiz wielokrotnego wyboru') {
      const currentAnswers = formValues.newAnswers;
      const isCurrentlyCorrect = currentAnswers[index].isCorrect;
      const numberOfCorrectAnswers = currentAnswers.filter((a) => a.isCorrect).length;
  
      if (isCurrentlyCorrect || numberOfCorrectAnswers < 3) {
        currentAnswers[index].isCorrect = !isCurrentlyCorrect;
        setFormValues({ ...formValues, newAnswers: [...currentAnswers] });
      } else {
        alert('Quiz wielokrotnego wyboru akceptuje maksymalnie 3 poprawne odpowiedzi.');
      }
    } else {
      const newAnswers = formValues.newAnswers.map((answer, i) => {
        return { ...answer, isCorrect: i === index };
      });
      setFormValues({ ...formValues, newAnswers });
    }
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/AddQuiz', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setLoading(false);
      } else {
        console.error('Form submission failed');
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="h-full w-full flex justify-center">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className='h-full w-full'>
        <div className="w-full h-full mt-40 flex justify-start">
          <div className="w-full flex flex-col">
            <div className="mb-2 flex flex-row h-1/4">
              <div className="border-solid border-2 w-1/2 mr-2 h-full border-five p-2">
                <div className="h-full w-full border-l-4 border-solid border-three pl-2 flex flex-col">
                  <label>Nazwa Quizu:</label>
                  <input
                    type="text"
                    placeholder="Nazwa Quizu"
                    name="NazwaQuiz"
                    value={formValues.NazwaQuiz}
                    onChange={(e) => setFormValues({ ...formValues, NazwaQuiz: e.target.value })}
                    required
                  ></input>
                </div>
              </div>
              <div className="border-solid border-2 w-1/2 h-full border-five p-2 mb-2">
                <div className="h-full w-full border-l-4 border-solid border-three pl-2 flex flex-col">
                  <label>Kategoria:</label>
                  <input
                    type="text"
                    placeholder="Kategoria"
                    name="KategoriaQuiz"
                    value={formValues.KategoriaQuiz}
                    onChange={(e) => setFormValues({ ...formValues, KategoriaQuiz: e.target.value })}
                    required
                  ></input>
                </div>
              </div>
            </div>
            <div className="mb-2 flex flex-row h-1/4">
              <div className="border-solid border-2 w-1/2 mr-2 h-full border-five p-2">
                <div className="h-full w-full border-l-4 border-solid border-three pl-2 flex flex-col">
                  <label>Typ Quizu:</label>
                  <select
                    name="TypQuiz"
                    value={formValues.TypQuiz}
                    onChange={handleTypQuizChange}
                    required
                  >
                    <option value="Flashcard">Flashcard</option>
                    <option value="Quiz pojedynczego wyboru">Quiz pojedynczego wyboru</option>
                    <option value="Quiz wielokrotnego wyboru">Quiz wielokrotnego wyboru</option>
                    <option value="Quiz bez limitu czasowego">Quiz bez limitu czasowego</option>
                    <option value="Quiz prawda fałsz">Quiz prawda fałsz</option>
                    <option value="Quiz na czas">Quiz na czas</option>
                  </select>
                </div>
              </div>
              <div className="border-solid border-2 w-1/2 h-full border-five p-2 mb-2">
                <div className="h-full w-full border-l-4 border-solid border-three pl-2 flex flex-col">
                  <label>Poziom trudności:</label>
                  <select
                    name="TrudnoscQuiz"
                    value={formValues.TrudnoscQuiz}
                    onChange={(e) => setFormValues({ ...formValues, TrudnoscQuiz: e.target.value })}
                    required
                  >
                    <option value="Łatwy">Łatwy</option>
                    <option value="Średni">Średni</option>
                    <option value="Trudny">Trudny</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-2 flex flex-row h-1/4">
              <div className="border-solid border-2 w-1/2 mr-2 h-full border-five p-2">
                <div className="h-full w-full border-l-4 border-solid border-three pl-2 flex flex-col">
                  <label>Pytanie:</label>
                  <input
                    type="text"
                    placeholder="Pytanie"
                    value={formValues.newQuestion}
                    onChange={handleQuestionChange}
                  ></input>
                </div>
              </div>
              <div className="border-solid border-2 w-1/2 h-full border-five p-2 mb-2">
                <div className="h-full w-full border-l-4 border-solid border-three pl-2 flex flex-col">
                  <label>Odpowiedzi:</label>
                  {formValues.newAnswers.map((answer, index) => (
                    <div key={index} className="answer-input">
                      <input
                        type="text"
                        placeholder={`Odpowiedź ${index + 1}`}
                        value={answer.answer}
                        onChange={(e) => handleAnswerChange(e, index)}
                      ></input>
                      <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={() => handleCorrectAnswerChange(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex h-1/6 w-full'>
            <button type="button" onClick={addQuestion} className="h-full w-full mr-2 border-five border-2">
              Dodaj pytanie
            </button>
            <button type="submit" className="h-full w-full border-five border-2" disabled={loading}>
              {loading ? 'Dodawanie w toku...' : 'Dodaj Quiz'}
            </button>
            </div>
            </div>
            <div className='flex flex-col w-1/3'>
            {formValues.Questions.map((question, index) => (
              <div className='w-full h-1/4 mb-2 ml-2 border-five border-2 p-2' >
                <div key={index} className=' h-full w-full overflow-y-scroll border-l-4 border-l-three pl-2'>
                <div >{`Pytanie ${index + 1}: ${question.question}`}</div>
                <div>Odpowiedzi:</div>
                <ul>
                  {question.answers.map((answer, answerIndex) => (
                    <li key={answerIndex}>{`${answer.answer} (Prawdziwa?: ${answer.isCorrect ? 'Tak' : 'Nie'})`}</li>
                  ))}
                </ul>
              </div>
              </div>
            ))}
            
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
