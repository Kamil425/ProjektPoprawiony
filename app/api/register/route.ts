import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req:any){
    try{
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await User.create({ name, email, password : hashedPassword });

        

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    }catch(error){
        return NextResponse.json({ message: "Failed to register user" }, { status: 500 });
    }
}