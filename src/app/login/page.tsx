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
        // Client-side validation with professional messages
        if (!isValidEmail(user.email)) {
            toast.error("Please enter a valid email address", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        if (!user.password || user.password.length < 1) {
            toast.error("Password is required", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        try {
            setLoading(true);

            // Show loading toast
            const loadingToast = toast.loading("Signing you in...", {
                position: 'top-center',
            });

            // Trim whitespace and prepare data
            const loginData = {
                email: user.email.trim().toLowerCase(),
                password: user.password
            };

            const response = await axios.post('/api/users/login', loginData);
            
            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show success message
            toast.success(`Welcome back! Redirecting to your profile...`, {
                duration: 3000,
                position: 'top-center',
                icon: '🎉',
            });

            console.log("Login successful:", response.data);
            
            // Small delay to show success message before redirect
            setTimeout(() => {
                router.push('/profile');
            }, 1500);

            
        } catch (error: any) {
            setLoading(false);
            
            // Handle different types of errors professionally
            let errorMessage = "Something went wrong. Please try again.";
            
            if (error.response?.status === 400) {
                errorMessage = error.response.data?.error || "Invalid email or password";
            } else if (error.response?.status === 404) {
                errorMessage = "Account not found. Please check your email or sign up.";
            } else if (error.response?.status >= 500) {
                errorMessage = "Server error. Please try again in a moment.";
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                errorMessage = "Network error. Please check your connection.";
            } else {
                errorMessage = error.response?.data?.error || error.response?.data?.message || errorMessage;
            }
            
            toast.error(errorMessage, {
                duration: 5000,
                position: 'top-center',
                icon: '❌',
            });
            
            console.error("Login error:", error);
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
                        {loading ? "Signing In..." : "Welcome Back"}
                    </h1>
                    <p className="text-sm text-gray-600 mb-4">Please sign in to your account</p>
                    <hr className='border-gray-300 mb-6' />
                </div>

                <div className='space-y-4'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                            Email Address
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='email'  
                            type="email" 
                            value={user.email} 
                            onChange={(e) => setUser({...user, email: e.target.value})} 
                            placeholder='Enter your email address'
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
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    <div className='text-center pt-4'>
                        <Link 
                            href='/signup' 
                            className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200'
                        >
                            Dont have an account? Create one here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}