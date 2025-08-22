import { dbConnect } from "@/utils/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";


export async function POST (request: NextRequest){
    try {
        const {email, password} =await request.json()

        if( !email || !password ) {
            return NextResponse.json(
                {error: "Email and password are required!"},
                {status: 400}
            )
        }

        await dbConnect()

        const existngUser =await  User.findOne({email})
        if(existngUser){
            return NextResponse.json(
                {error: "User already exists"},
                { status: 400}
            )
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            {message: "User Registered Successfully"},
            {status: 400}
        )

    } catch (error) {
        console.error ()
        return NextResponse.json(
            {error: "User registration failed!"},
            {status: 400}
        )
        
    }
}