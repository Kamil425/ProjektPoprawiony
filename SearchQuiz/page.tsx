/*"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
export default function SearchQuiz() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false); 
  const [singleFlag, setSingleFlag] = useState(false);
  const [multiFlag, setMultiFlag] = useState(false);
  const [noTimeFlag, setNoTimeFlag] = useState(false);
  const [trueFlag, setTrueFlag] = useState(false);
  const [timeFlag, setTimeFlag] = useState(false);
  
  const passFilters = async (e: any) => {
    e.preventDefault();
    let updatedFilters = [...searchFilters];
  
    if (searchFilters.includes(e.currentTarget.getAttribute('data-value'))) {
      updatedFilters = updatedFilters.filter(
        (filter) => filter !== e.currentTarget.getAttribute('data-value')
      );
      // Remove corresponding flag
      removeFlag(e.currentTarget.getAttribute('data-value'));
    } else {
      updatedFilters.push(e.currentTarget.getAttribute('data-value'));
      // Add corresponding flag
      addFlag(e.currentTarget.getAttribute('data-value'));
    }
  
    setSearchFilters(updatedFilters);
    console.log(updatedFilters);
  
  };
  
  const addFlag = (filter: string) => {
    switch (filter) {
      case 'Quiz pojedynczego wyboru':
        setSingleFlag(true);
        break;
      case 'Quiz wielokrotnego wyboru':
        setMultiFlag(true);
        break;
      case 'Quiz prawda fałsz':
        setTrueFlag(true);
        break;
      case 'Quiz na czas':
        setTimeFlag(true);
        break;
      case 'Quiz bez limitu czasowego':
        setNoTimeFlag(true);
        break;
      default:
        break;
    }
  };
  
  const removeFlag = (filter: string) => {
    switch (filter) {
      case 'Quiz pojedynczego wyboru':
        setSingleFlag(false);
        break;
      case 'Quiz wielokrotnego wyboru':
        setMultiFlag(false);
        break;
      case 'Quiz prawda fałsz':
        setTrueFlag(false);
        break;
      case 'Quiz na czas':
        setTimeFlag(false);
        break;
      case 'Quiz bez limitu czasowego':
        setNoTimeFlag(false);
        break;
      default:
        break;
    }
  }; 
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement & { value: string }>) => {
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
        body: JSON.stringify({ searchQuery: event.target.value.toLowerCase(), searchFilters: searchFilters }),
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
              <button className={`ml-2 bg-four rounded-xl ${singleFlag ? 'border-2 border-three' :''}`} data-value="Quiz pojedynczego wyboru" onClick={passFilters}>Quiz Pojedynczego Wyboru</button>
              <button className={`ml-2 bg-four rounded-xl ${multiFlag ? 'border-2 border-three' :''}`} data-value="Quiz wielokrotnego wyboru" onClick={passFilters}>Quiz Wielokrotnego Wyboru</button>
              <button className={`ml-2 bg-four rounded-xl ${trueFlag ? 'border-2 border-three' :''}`} data-value="Quiz prawda fałsz" onClick={passFilters}>Quiz Prawda Fałsz</button>
              <button className={`ml-2 bg-four rounded-xl ${timeFlag ? 'border-2 border-three' :''}`} data-value="Quiz na czas" onClick={passFilters}>Quiz Na Czas</button>
              <button className={`ml-2 bg-four rounded-xl ${noTimeFlag ? 'border-2 border-three' :''}`} data-value="Quiz bez limitu czasowego" onClick={passFilters}>Quiz Bez Limitu Czasowego</button>
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
}*/


"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function SearchQuiz() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [singleFlag, setSingleFlag] = useState(false);
  const [multiFlag, setMultiFlag] = useState(false);
  const [noTimeFlag, setNoTimeFlag] = useState(false);
  const [trueFlag, setTrueFlag] = useState(false);
  const [timeFlag, setTimeFlag] = useState(false);

  const passFilters = async (e: any) => {
    e.preventDefault();
    let updatedFilters = [...searchFilters];

    if (searchFilters.includes(e.currentTarget.getAttribute('data-value'))) {
      updatedFilters = updatedFilters.filter(
        (filter) => filter !== e.currentTarget.getAttribute('data-value')
      );
      // Remove corresponding flag
      removeFlag(e.currentTarget.getAttribute('data-value'));
    } else {
      updatedFilters.push(e.currentTarget.getAttribute('data-value'));
      // Add corresponding flag
      addFlag(e.currentTarget.getAttribute('data-value'));
    }

    setSearchFilters(updatedFilters);
    console.log(updatedFilters);
  };

  const addFlag = (filter: string) => {
    switch (filter) {
      case 'Quiz pojedynczego wyboru':
        setSingleFlag(true);
        break;
      case 'Quiz wielokrotnego wyboru':
        setMultiFlag(true);
        break;
      case 'Quiz prawda fałsz':
        setTrueFlag(true);
        break;
      case 'Quiz na czas':
        setTimeFlag(true);
        break;
      case 'Quiz bez limitu czasowego':
        setNoTimeFlag(true);
        break;
      default:
        break;
    }
  };

  const removeFlag = (filter: string) => {
    switch (filter) {
      case 'Quiz pojedynczego wyboru':
        setSingleFlag(false);
        break;
      case 'Quiz wielokrotnego wyboru':
        setMultiFlag(false);
        break;
      case 'Quiz prawda fałsz':
        setTrueFlag(false);
        break;
      case 'Quiz na czas':
        setTimeFlag(false);
        break;
      case 'Quiz bez limitu czasowego':
        setNoTimeFlag(false);
        break;
      default:
        break;
    }
  };

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement & { value: string }>) => {
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
        body: JSON.stringify({ searchQuery: event.target.value.toLowerCase(), searchFilters: searchFilters }),
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
  };

  const router = useRouter();

  const PassQuiz = async (e: any) => {
    const quizId = e.currentTarget.getAttribute('data-value');
    const quizType = e.currentTarget.getAttribute('data-type');

    if (!quizId) {
      console.error('Brak quizId');
      return;
    }

    // Redirect to the appropriate quiz type page and pass the quizId as a query parameter
    if (quizType === 'Quiz wielokrotnego wyboru') {
      router.push(`/QuizMultiChoice?id=${quizId}`);
    } else {
      router.push(`/Quiz?id=${quizId}`);
    }
  };

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
              <button className={`ml-2 bg-four rounded-xl ${singleFlag ? 'border-2 border-three' : ''}`} data-value="Quiz pojedynczego wyboru" onClick={passFilters}>Quiz Pojedynczego Wyboru</button>
              <button className={`ml-2 bg-four rounded-xl ${multiFlag ? 'border-2 border-three' : ''}`} data-value="Quiz wielokrotnego wyboru" data-type="Quiz wielokrotnego wyboru" onClick={passFilters}>Quiz Wielokrotnego Wyboru</button>
              <button className={`ml-2 bg-four rounded-xl ${trueFlag ? 'border-2 border-three' : ''}`} data-value="Quiz prawda fałsz" onClick={passFilters}>Quiz Prawda Fałsz</button>
              <button className={`ml-2 bg-four rounded-xl ${timeFlag ? 'border-2 border-three' : ''}`} data-value="Quiz na czas" onClick={passFilters}>Quiz Na Czas</button>
              <button className={`ml-2 bg-four rounded-xl ${noTimeFlag ? 'border-2 border-three' : ''}`} data-value="Quiz bez limitu czasowego" onClick={passFilters}>Quiz Bez Limitu Czasowego</button>
            </div>
          </div>
          <div className="w-full flex flex-col ml-2">
            {loading && <p>Trwa wyszukiwanie...</p>}
            {searchResults.length > 0 && (
              <div>
                <h2>Wyniki wyszukiwania:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {searchResults.map((quiz: any) => (
                    <div key={quiz._id} className="p-2 border-2 rounded-md" data-value={quiz._id} data-type={quiz.Typ} onClick={PassQuiz}>
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
