"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: '',
        password: ''
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    // Email validation regex
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onLogin = async () => {
        // Client-side validation
        if (!isValidEmail(user.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!user.password) {
            toast.error("Please enter your password");
            return;
        }

        try {
            setLoading(true);


            const response=await axios.post('/api/users/login', user);
            toast.success(response.data.message || "Login successful!");
            console.log("Login successful:", response.data);
            // Redirect to home page or dashboard
            router.push('/profile');

            
        } catch (error: any) {
           
           // Show specific error message from server if available
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               "An error occurred while signing up. Please try again.";
            
            toast.error(errorMessage);
            console.error("Error during signup:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Enable button only when all fields are filled and valid
        const isFormValid = 
            isValidEmail(user.email) && 
            user.password.length > 0;
        
        setButtonDisabled(!isFormValid);
    }, [user]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        {loading ? "Signing In..." : "Login"}
                    </h1>
                    <hr className='border-gray-300 mb-6' />
                </div>

                <div className='space-y-4'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                            Email
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='email'  
                            type="email" 
                            value={user.email} 
                            onChange={(e) => setUser({...user, email: e.target.value})} 
                            placeholder='Enter your email'
                            disabled={loading}
                            required
                        />
                        {user.email.length > 0 && !isValidEmail(user.email) && (
                            <p className='text-sm text-red-600 mt-1'>
                                Please enter a valid email address
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>
                            Password
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='password' 
                            type="password" 
                            value={user.password} 
                            onChange={(e) => setUser({...user, password: e.target.value})} 
                            placeholder='Enter your password'
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        onClick={onLogin} 
                        disabled={buttonDisabled || loading}
                        className={`w-full font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            buttonDisabled || loading 
                                ? 'bg-gray-400 cursor-not-allowed text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {loading ? "Signing In..." : "Login"}
                    </button>

                    <div className='text-center pt-4'>
                        <Link 
                            href='/signup' 
                            className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200'
                        >
                            Dont have an account? Visit SignUp page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}