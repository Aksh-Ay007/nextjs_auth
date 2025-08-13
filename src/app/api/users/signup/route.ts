

import { connect } from "@/dbconfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";


connect()



export async function POST(request:NextRequest){

    try {

        const reqBody=await request.json()

        const {userName,email,password}=reqBody

        const user=await User.findOne({email})

        if(user){

            return NextResponse.json({
                error:"user already exist"

            },{status:400})
        }
        
        //hashpassword
        if(!userName || !email || !password){
            return NextResponse.json({
                error:"all fields are required"
            },{status:400})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt) 

        //create user
        const newUser=await new User({
            userName:userName,
            email,
            password:hashedPassword
        })
        
   
        const savedUser=await newUser.save()

        console.log("User created successfully:", savedUser); 

        // Optionally, send a verification email
await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
        
        console.log("User saved successfully:", savedUser);

        return NextResponse.json({message:'User created successfully', user: savedUser}, { status: 201 });

        
    }   catch (error: unknown) {
        console.error("Signup error:", error); // Add this line
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

