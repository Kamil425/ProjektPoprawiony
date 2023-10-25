import Navbar from '../components/Navbar'
import Link from 'next/link'
import React from 'react';

export default function About() {
    return(
        
<div className='h-full w-full flex flex-col'>
<div className='h-1/6 w-full flex justify-center'><Navbar/></div>
  
  
  <div className="h-full w-full flex justify-center flex-col items-center mt-40">
    
    <div className="h-full w-4/6 flex flex-wrap pt-6">
        
      <h1 className="text-center 2xl:text-6xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6">O Nas</h1>
      <p className="text-left font-semibold">Witaj na QuizGrad - Twoim źródle rozrywki, nauki i zabawy! Jesteśmy zespołem pasjonatów, którzy stworzyli tę platformę, aby dostarczyć Ci niekończący się przepływ ciekawych quizów na różne tematy. Nasza misja to inspiracja, uczenie i sprawianie, by nauka była przyjemnością!</p>

      <h2 className="text-center 2xl:text-4xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6 mt-6">Nasza Historia</h2>
      <p className="text-left font-semibold">QuizGrad został założony w 2023 roku przez grupę entuzjastów, którzy uwielbiają rozwiązywać quizy i dzielić się wiedzą. Zrodziła się idea stworzenia miejsca, gdzie każdy może przetestować swoje umiejętności, dowiedzieć się czegoś nowego i po prostu dobrze się bawić.</p>

      <h2 className="text-center 2xl:text-4xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6 mt-6">Dlaczego QuizGrad?</h2>
      <p className="text-left font-semibold">Na QuizGrad wierzymy, że nauka może być fascynująca i dostępna dla wszystkich. Nasze quizy obejmują szeroki zakres tematyczny, od historii przez naukę po popkulturę. Niezależnie od tego, czy jesteś uczniem, nauczycielem czy po prostu miłośnikiem ciekawostek, na naszej stronie znajdziesz coś dla siebie.</p>

      <h2 className="text-center 2xl:text-4xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6 mt-6">Własne Quizy</h2>
      <p className="text-left font-semibold">Dodatkowo, QuizGrad daje Ci możliwość stworzenia własnych quizów! Jeśli masz wiedzę do podzielenia się z innymi lub chciałbyś zabawić się w tworzenie własnych pytań, to jesteś w odpowiednim miejscu. Nasza społeczność jest otwarta na wszystkich twórczych umysłach.</p>

      <h2 className="text-center 2xl:text-4xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold mb-6 mt-6">Dla Wszystkich Grup Wiekowych</h2>
      <p className="text-left font-semibold">QuizGrad jest przyjazny dla wszystkich grup wiekowych. Nasze quizy są dostosowane do różnych poziomów trudności, więc zarówno dzieci, młodzież, jak i dorośli mogą tu znaleźć odpowiednie wyzwania intelektualne.</p>

      <h2 className="text-center 2xl:text-4xl xl:text-5xl l:text-4xl md:text-4xl sm:text-2xl max-sm:text-xl font-semibold 6 mt-6">Nasza Misja</h2>
      <p className="text-left font-semibold">Naszym celem jest promowanie nauki i rozrywki poprzez quizy. Chcemy, aby każdy, kto odwiedza QuizGrad, mógł się czegoś nowego nauczyć i jednocześnie dobrze się bawić. Zachęcamy do regularnego odwiedzania naszej strony, rozwiązywania quizów i eksplorowania fascynującego świata wiedzy.</p>
    </div>
    <div className="h-1/4 w-1/2">
      
    </div>
  </div>
</div>

        
            
            
        
    )
}