"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
export default function SearchQuiz() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false); // Dodajemy stan noResults
  
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setLoading(true);

    if (!event.target.value) {
      setLoading(false);
      setSearchResults([]);
      setSearchQuery(''); 
      return;
    }    

    try {
      const response = await fetch('/api/SearchQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: event.target.value.toLowerCase() }),
      });

      if (response.ok) {
        const data = await response.json();
        const filteredResults = data.data.filter((quiz: any) =>
          quiz.Nazwa_Quizu.toLowerCase().includes(event.target.value.toLowerCase())
        );

        if (filteredResults.length === 0) {
          setNoResults(true);
          setSearchResults([]);
        } else {
          setNoResults(false);
          setSearchResults(filteredResults);
        }
      } else {
        console.error('Błąd podczas wyszukiwania quizu.');
      }
    } catch (error) {
      console.error('Błąd sieci:', error);
    } finally {
      setLoading(false);
    }
  }
  const router = useRouter();
  const PassQuiz = async(e:any) => {
      const quizId = e.currentTarget.getAttribute('data-value');
  
      if (!quizId) {
        console.error('Brak quizId');
        return;
      }
      console.log(quizId)
      // Redirect to the 'Quiz' page and pass the quizId as a query parameter
      router.push(`/Quiz?id=${quizId}`);
    }
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className='w-full flex justify-center'>
      <Navbar />
      </div>
      <form>
        <div className="w-full h-full mt-40 flex flex-col justify-start">
          <div className="w-full mb-2 ml-4">
            Wyszukaj:
            <div className="border-l-three border-l-4 pl-2">
              <input
                type="text"
                placeholder="Wyszukaj quizy"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="w-full flex flex-col ml-2">
  {loading && <p>Trwa wyszukiwanie...</p>}
  {searchResults.length > 0 && (
    <div>
      <h2>Wyniki wyszukiwania:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {searchResults.map((quiz: any) => (
          <div key={quiz._id} className="p-2 border-2 rounded-md" data-value={quiz._id} onClick={PassQuiz}>
            <p><b>Nazwa Quizu:</b> {quiz.Nazwa_Quizu}</p>
            <p><b>Kategoria:</b> {quiz.Kategoria}</p>
            <p><b>Trudność:</b> {quiz.Trudność}</p>
            <p><b>Typ:</b> {quiz.Typ}</p>
            <p><b>Data Utworzenia: </b>{formatDate(quiz.Utworzony)}</p>
          </div>
        ))}
      </div>
    </div>
    )}
    {noResults && !loading && (
      <p>Brak pasujących quizów.</p>
    )}
          </div>
        </div>
      </form>
    </div>
  );
}