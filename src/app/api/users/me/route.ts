import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        // Fix: Remove the object wrapper and just pass the userId directly
        const user = await User.findById(userId).select("-password -__v");

        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "User data retrieved successfully",
            data: user  // Changed from 'user' to 'data' to match your frontend expectation
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in GET /api/users/me:", error);
        
        // Handle JWT errors specifically
        if (error.message === "Invalid token") {
            return NextResponse.json({ 
                error: "Authentication required" 
            }, { status: 401 });
        }
        
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}