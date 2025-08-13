import { connect } from "@/dbconfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

// Ensure database connection
connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    // Validate token presence
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: "Verification token is required" 
        }, 
        { status: 400 }
      );
    }

    console.log("Processing verification for token:", token.substring(0, 10) + "...");

    // Find user with valid token
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid or expired verification token" 
        }, 
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { 
          success: true,
          message: "Email is already verified" 
        }, 
        { status: 200 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    console.log("Email verified successfully for user:", user.email);

    return NextResponse.json(
      { 
        success: true,
        message: "Email verified successfully" 
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error in email verification:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error. Please try again later." 
      }, 
      { status: 500 }
    );
  }
}