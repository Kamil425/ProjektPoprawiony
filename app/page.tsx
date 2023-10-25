import Image from 'next/image'
import Navbar from './components/Navbar'
import StartPage from './components/Startpage'
export default function Home() {
  return (
   <div className='h-full w-full flex flex-col'>
    <div className='h-1/6 w-full flex justify-center'><Navbar/></div>
    <div className='h-5/6 w-full flex justify-center'><StartPage/></div>
   </div>
  )
}
