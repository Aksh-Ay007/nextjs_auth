// src/helpers/getDataFromToken.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';
        
        if (!token) {
            throw new Error("No token found");
        }

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        
        if (!decodedToken) {
            throw new Error("Invalid token");
        }

        console.log("Decoded token:", decodedToken); // Debug log
        
        // Return decodedToken.userId because that's what's actually in your token
        return decodedToken.userId;
        
    } catch (error: any) {
        console.error("Error extracting data from token:", error.message);
        throw new Error("Invalid token"); // Throw error instead of returning null
    }
}