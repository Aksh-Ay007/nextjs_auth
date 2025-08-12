import { NextResponse } from 'next/server';

export async function GET() {

    const response=NextResponse.json({message:"Logout successful"}, { status: 200 });

    response.cookies.set('token', '', {
        httpOnly: true, 
        expires: new Date(0), // Set expiration date to the past to delete the cookie
        
    })

    return response;

    try {
        
    } catch (error: any) {
        
        return NextResponse.json({ error:error.message }, { status: 500 });
    }
}