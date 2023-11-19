"use client"
import Image from 'next/image'
import Navbar from '../components/Navbar'
import {useState } from "react";
import FlashCardImage from '/public/Flashcard.jpg'
import SingleChoiceImage from '/public/SingleChoice.jpg'
import MultipleChoiceImage from '/public/MultipleChoice.jpg'
import NoTimeImage from '/public/NoTime.jpg'
import SpeedrunImage from '/public/Speedrun.jpg'
import TrueFalseImage from '/public/TrueFalse.jpg'
export default function Home() {
const [Flashcard, SetFlashcard] = useState(false);
const [SingleChoice, SetSingleChoice] = useState(false);
const [MultipleChoice, SetMultipleChoice] = useState(false);
const [NoTime, SetNoTime] = useState(false);
const [TrueFalse, SetTrueFalse] = useState(false);
const [Speed, SetSpeed] = useState(false);
  return (
   <div className='h-full w-full flex flex-col'>
    <div className='h-1/6 w-full flex justify-center'><Navbar/></div>
    <div className='h-5/6 w-full flex flex-col items-center justify-center p-4'>
        <div className='h-1/2 w-5/6 flex justify-center items-center mb-4'>
            <div className='w-1/3 h-full mr-4 p-4'>
                <div className='h-full w-5/6  flex items-center  justify-center'>
                    <Image src={FlashCardImage} alt="FlashCard" className='h-full w-full hover:opacity-30 transition-all duration-300' onMouseEnter={() => SetFlashcard(true)} onMouseLeave={() => SetFlashcard(false)}/>
                    <p className={`text-center md:text-2xl font-semibold sm:text-sm absolute  ${Flashcard ? 'opacity-100' : 'opacity-0'}`}>Flashcard</p>
                </div>
            </div>
            <div className='w-1/3 h-full mr-4 p-4'>
                <div className='h-full w-5/6  flex items-center relative justify-center'>
                    <Image src={SingleChoiceImage} alt="Quiz pojedynczego wyboru" className='h-full w-full hover:opacity-30 transition-all duration-300' onMouseEnter={() => SetSingleChoice(true)} onMouseLeave={() => SetSingleChoice(false)}/>
                    <p className={`text-center md:text-2xl font-semibold sm:text-sm sm:flex-wrap absolute ${SingleChoice ? 'opacity-100' : 'opacity-0'}`}>Quiz <br/>pojedynczego wyboru</p>
                </div>
            </div>
            <div className='w-1/3 h-full mr-4 p-4'>
                <div className='h-full w-5/6  flex items-center relative justify-center'>
                    <Image src={MultipleChoiceImage} alt="Quiz wielokrotnego wyboru" className='h-full w-full hover:opacity-30 transition-all duration-300' onMouseEnter={() => SetMultipleChoice(true)} onMouseLeave={() => SetMultipleChoice(false)}/>
                    <p className={`text-center md:text-2xl font-semibold sm:text-sm sm:flex-wrap absolute ${MultipleChoice ? 'opacity-100' : 'opacity-0'}`}>Quiz <br/>wielokrotnego  wyboru</p>
                </div>
            </div>
        </div>
        <div className='h-1/2 w-5/6 flex justify-center items-center mb-4'>
        <div className='w-1/3 h-full mr-4 p-4'>
                <div className='h-full w-5/6  flex items-center relative justify-center'>
                    <Image src={NoTimeImage} alt="Quiz bez limitu czasowego" className='h-full w-full hover:opacity-30 transition-all duration-300' onMouseEnter={() => SetNoTime(true)} onMouseLeave={() => SetNoTime(false)}/>
                    <p className={`text-center md:text-2xl font-semibold sm:text-sm sm:flex-wrap absolute ${NoTime ? 'opacity-100' : 'opacity-0'}`}>Quiz bez limitu czasowego</p>
                </div>
            </div>
            <div className='w-1/3 h-full mr-4 p-4'>
                <div className='h-full w-5/6  flex items-center justify-center'>
                    <Image src={TrueFalseImage} alt="Quiz prawda fałsz" className='h-full w-full hover:opacity-30 transition-all duration-300' onMouseEnter={() => SetTrueFalse(true)} onMouseLeave={() => SetTrueFalse(false)}/>
                    <p className={`text-center md:text-2xl font-semibold sm:text-sm sm:flex-wrap absolute ${TrueFalse ? 'opacity-100' : 'opacity-0'}`}>Quiz prawda fałsz</p>
                </div>
            </div>
            <div className='w-1/3 h-full mr-4 p-4'>
                <div className='h-full w-5/6  flex items-center justify-center'>
                    <Image src={SpeedrunImage} alt="Quiz na czas" className='h-full w-full hover:opacity-30 transition-all duration-300' onMouseEnter={() => SetSpeed(true)} onMouseLeave={() => SetSpeed(false)}/>
                    <p className={`text-center md:text-2xl font-semibold sm:text-sm sm:flex-wrap absolute ${Speed ? 'opacity-100' : 'opacity-0'}`}>Quiz na czas</p>
                </div>
            </div>
        </div>
    </div>
   </div>
  )
}
