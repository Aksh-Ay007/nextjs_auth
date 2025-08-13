import { connect } from "@/dbconfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    console.log("Received token:", token);

    // Await the user lookup
    const user = await User.findOne({
      varifyToken: token,
      varifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    console.log("User found:", user);

    user.isVarified = true;
    user.varifyToken = undefined;
    user.varifyTokenExpiry = undefined;
    await user.save();

    console.log("User verified successfully:", user);
    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST /api/users/varifyemails:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}