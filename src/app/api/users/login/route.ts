import { connect } from "@/dbconfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Prepare token data
        const tokenData = {
            userId: user._id,
            userName: user.userName,
            email: user.email
        };

        // Sign JWT token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        // Prepare response
        const response = NextResponse.json({
            message: "Login successful",
            user: {
                userId: user._id,
                userName: user.userName,
                email: user.email
            }
        });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error: unknown) {
        console.error("login error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}