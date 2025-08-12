"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        userName: '',
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

    // Password validation (at least 6 characters)
    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const onSignup = async () => {
        // Client-side validation with professional messages
        if (!user.userName.trim()) {
            toast.error("Full name is required", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        if (user.userName.trim().length < 2) {
            toast.error("Name must be at least 2 characters long", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        if (!isValidEmail(user.email)) {
            toast.error("Please enter a valid email address", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        if (!isValidPassword(user.password)) {
            toast.error("Password must be at least 6 characters long", {
                duration: 4000,
                position: 'top-center',
            });
            return;
        }

        try {
            setLoading(true);

            // Show loading toast
            const loadingToast = toast.loading("Creating your account...", {
                position: 'top-center',
            });

            // Trim whitespace from inputs
            const userData = {
                userName: user.userName.trim(),
                email: user.email.trim().toLowerCase(),
                password: user.password
            };

            const response = await axios.post('/api/users/signup', userData);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show success message
            toast.success(`Account created successfully! Welcome ${userData.userName}! 🎉`, {
                duration: 4000,
                position: 'top-center',
                icon: '✅',
            });

            console.log("User created successfully:", response.data.user);
            
            // Small delay to show success message before redirect
            setTimeout(() => {
                toast.success("Redirecting to login page...", {
                    duration: 2000,
                    position: 'top-center',
                });
                router.push('/login');
            }, 2000);
            
        } catch (error: any) {
            setLoading(false);
            
            // Handle different types of errors professionally
            let errorMessage = "Failed to create account. Please try again.";
            
            if (error.response?.status === 400) {
                const serverError = error.response.data?.error;
                if (serverError?.includes("already exists") || serverError?.includes("duplicate")) {
                    errorMessage = "An account with this email already exists. Please try logging in.";
                } else if (serverError?.includes("validation") || serverError?.includes("required")) {
                    errorMessage = "Please check all required fields and try again.";
                } else {
                    errorMessage = serverError || errorMessage;
                }
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
            
            console.error("Signup error:", error);
        }
    };

    useEffect(() => {
        // Enable button only when all fields are filled and valid
        const isFormValid = 
            user.userName.trim().length >= 2 && 
            isValidEmail(user.email) && 
            isValidPassword(user.password);
        
        setButtonDisabled(!isFormValid);
    }, [user]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        {loading ? "Creating Account..." : "Create Account"}
                    </h1>
                    <p className="text-sm text-gray-600 mb-4">Join us today! It only takes a minute</p>
                    <hr className='border-gray-300 mb-6' />
                </div>

                <div className='space-y-4'>
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                            Full Name
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='name' 
                            type="text" 
                            value={user.userName} 
                            onChange={(e) => setUser({...user, userName: e.target.value})} 
                            placeholder='Enter your full name'
                            disabled={loading}
                            required
                        />
                        {user.userName.trim().length > 0 && user.userName.trim().length < 2 && (
                            <p className='text-sm text-red-600 mt-1'>
                                Name must be at least 2 characters long
                            </p>
                        )}
                    </div>

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
                            placeholder='Create a strong password (min. 6 characters)'
                            disabled={loading}
                            required
                        />
                        {user.password.length > 0 && user.password.length < 6 && (
                            <p className='text-sm text-red-600 mt-1'>
                                Password must be at least 6 characters long
                            </p>
                        )}
                    </div>

                    <button 
                        onClick={onSignup} 
                        disabled={buttonDisabled || loading}
                        className={`w-full font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            buttonDisabled || loading 
                                ? 'bg-gray-400 cursor-not-allowed text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <div className='text-center pt-4'>
                        <Link 
                            href='/login' 
                            className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200'
                        >
                            Already have an account? Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}