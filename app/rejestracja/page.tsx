"use client";
import React from "react";
import Image from 'next/image'
import HandsLeft from '/public/HandsLeft.svg'
import Logo from 'public/Logo.webp'
import Link from "next/link";
import{useState} from 'react';
import { useRouter } from "next/navigation";
const StartPage = ()=>{
  window.location.href = "/";
}
const Rejestracja = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleSubmit  = async(e:any) => {
        e.preventDefault();

        if (!name || !email || !password) {
          alert("Uzupełnij wszystkie pola!");
          return;
        } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
          alert("Niepoprawny email!");
          return;
        } else if (!/^[a-zA-Z]+$/.test(name)) {
          alert("Imię może zawierać tylko litery!");
          return;
        } else if (!/(?=.*[A-Z])/.test(password)) {
          alert("Hasło musi zawierać co najmniej jedną dużą literę!");
          return;
        } else if (!/[!@#$%^&*]/.test(password)) {
          alert("Hasło musi zawierać co najmniej jeden znak specjalny: !@#$%^&*");
          return;
        } else if (password.length < 6) {
          alert("Hasło musi składać się z co najmniej 6 znaków!");
          return;
        }        
               
        try{

            const resUserExists = await fetch("api/userExists",{

                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });
            const {user} = await resUserExists.json();
            if(user){
                alert("User already exists!");
                return;
            }
            

            const res = await fetch("/api/register",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name, 
                    email, 
                    password,})
            });
            if (res.ok){
                const form = e.target;
                form.reset();
                router.push("/login");
            }
            else{
                alert("Something went wrong!");
            }
        }catch(err){console.log("Error during registration",err)}
    };

    console.log("Name : ", name);

    return (
  
<div className="h-full w-full flex flex-row p-5">
  <div className="h-full w-1/2 flex flex-col items-center justify-center">
    <Image src={Logo} alt="Logo" className="w-3/12" onClick={StartPage}></Image>
    <div className="p-6">Zarejestruj swoje konto</div>
    <form className="w-1/2 p-5" onSubmit={handleSubmit}>
      <div className="p-5 mb-2 border-2">
        <div className="border-l-three border-l-4 pl-2">
        <label>Imie:</label><br />
        <input type="text" className="h-1/4 w-full" onChange={e=> setName(e.target.value)}/><br />
        </div>
      </div>
      <div className="p-5 mb-2 border-2">
        <div className="border-l-three border-l-4 pl-2">
      <label>Email:</label><br />
      <input type="text" className="h-1/4 w-full" onChange={e => setEmail(e.target.value)}/><br />
      </div>
      </div>
      <div className="p-5 mb-2 border-2">
        <div className="border-l-three border-l-4 pl-2">
      <label>Hasło:</label><br />
      <input type="password" className="h-1/4 w-full" onChange={e => setPassword(e.target.value)} /><br />
      </div>
      </div>
      <button className="h-1/4 w-full bg-three">Zarejestruj się</button>
    </form>
  </div>
  <div className="h-full w-1/2 flex border justify-center">
    <Image src={HandsLeft} alt="Zdjecie" />
  </div>
  <div className="h-full w-1/2 flex"></div>
</div>


  
  
  );
  }
  
  export default Rejestracja;