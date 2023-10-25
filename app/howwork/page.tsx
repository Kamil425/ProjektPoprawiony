import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-1/6 w-full flex justify-center">
        <Navbar />
      </div>

      <div className="h-full w-full flex justify-center flex-col items-center mt-40">
        <div className="h-full w-4/6 flex flex-col pt-6">
          <h1 className="text-center 2xl:text-6xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6">
            Strona Quizowa
          </h1>
          <p className="text-left font-semibold">
            Witaj na naszej stronie do quizów, gdzie możesz rywalizować z innymi graczami i uczyć się nowych rzeczy!
          </p>
          <h2 className="text-center 2xl:text-5xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6 mt-6">
            Główne funkcje:
          </h2>
          <ul>
            <li><b>Rywalizacja:</b> Bierz udział w quizach i rywalizuj z innymi graczami.</li>
            <li><b>Uczenie się:</b> Rozwijaj swoją wiedzę, odpowiadając na pytania w quizach.</li>
            <li><b>Historia quizów:</b> Przeglądaj historię swoich wcześniejszych quizów i wyniki.</li>
            <li><b>Dodawanie własnych quizów:</b> Dodawaj własne quizy i dziel się nimi z innymi użytkownikami.</li>
            <li><b>Wyszukiwarka quizów:</b> Szukaj quizów według kategorii, tematu lub trudności.</li>
            <li><b>System punktacji:</b> Zdobywaj punkty za poprawne odpowiedzi i ścigaj się o miejsce na liście liderów.</li>
          </ul>
        </div>
        <div className="h-1/4 w-1/2"></div>
      </div>
    </div>
  );
};

export default Home;